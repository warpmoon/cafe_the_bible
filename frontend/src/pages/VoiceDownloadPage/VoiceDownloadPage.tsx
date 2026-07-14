import React, { useState } from 'react';
import { useBooks, useChapters } from '../../hooks/useBible';
import { getVoiceRecords } from '../../api/bible';
import { VoiceRecord } from '../../types/bible';
import { Download, Loader2, Info, Headphones } from 'lucide-react';
import styles from './VoiceDownloadPage.module.css';

type DownloadType = 'verse' | 'chapter' | 'book' | 'range';

const VoiceDownloadPage: React.FC = () => {
  const { data: books } = useBooks();

  const [downloadType, setDownloadType] = useState<DownloadType>('verse');
  const [selectedBookId, setSelectedBookId] = useState<number>(0);
  const [selectedChapter, setSelectedChapter] = useState<number>(0);
  
  // Range selection states
  const [startBookId, setStartBookId] = useState<number>(0);
  const [startChapter, setStartChapter] = useState<number>(0);
  const [endBookId, setEndBookId] = useState<number>(0);
  const [endChapter, setEndChapter] = useState<number>(0);

  const [records, setRecords] = useState<VoiceRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Progress states for merging
  const [mergeStatus, setMergeStatus] = useState<string>('');
  const [mergeProgress, setMergeProgress] = useState<number>(-1);

  // Fetch chapters based on chosen book
  const { data: chapters } = useChapters(selectedBookId);
  const { data: startChapters } = useChapters(startBookId);
  const { data: endChapters } = useChapters(endBookId);

  const allBooksList = books ? [...books.OT, ...books.NT] : [];



  // Fetch records matching criteria
  const handleSearch = async () => {
    if (downloadType === 'verse' && (!selectedBookId || !selectedChapter)) {
      alert('성경 책과 장을 선택해 주세요.');
      return;
    }
    if (downloadType === 'chapter' && (!selectedBookId || !selectedChapter)) {
      alert('성경 책과 장을 선택해 주세요.');
      return;
    }
    if (downloadType === 'book' && !selectedBookId) {
      alert('성경 책을 선택해 주세요.');
      return;
    }
    if (downloadType === 'range' && (!startBookId || !startChapter || !endBookId || !endChapter)) {
      alert('시작 구간과 종료 구간을 완벽히 선택해 주세요.');
      return;
    }

    setIsLoading(true);
    setRecords([]);

    try {
      if (downloadType === 'verse' || downloadType === 'chapter') {
        const data = await getVoiceRecords({ book: selectedBookId, chapter: selectedChapter });
        setRecords(data);
      } else if (downloadType === 'book') {
        const data = await getVoiceRecords({ book: selectedBookId });
        setRecords(data);
      } else if (downloadType === 'range') {
        // 구간 조회의 경우 백엔드에서 모든 녹음을 긁어온 뒤 프론트에서 범위 필터링
        // (간편한 연산을 위해 시작 책 순서 ~ 종료 책 순서 범위 활용)
        const startBook = allBooksList.find(b => b.id === startBookId);
        const endBook = allBooksList.find(b => b.id === endBookId);

        if (startBook && endBook) {
          if (startBook.order > endBook.order || (startBook.order === endBook.order && startChapter > endChapter)) {
            alert('시작 구간이 종료 구간보다 늦을 수 없습니다.');
            setIsLoading(false);
            return;
          }

          // 시작 책부터 종료 책까지의 모든 녹음을 병렬 조회
          const bookIdsToFetch: number[] = [];
          for (const book of allBooksList) {
            if (book.order >= startBook.order && book.order <= endBook.order) {
              bookIdsToFetch.push(book.id);
            }
          }

          const fetchPromises = bookIdsToFetch.map(bid => getVoiceRecords({ book: bid }));
          const results = await Promise.all(fetchPromises);
          const combined = results.flat();

          // 세부 장 범위 필터링
          const filtered = combined.filter(rec => {
            const currentBook = allBooksList.find(b => b.id === rec.book_id);
            if (!currentBook) return false;

            if (currentBook.order === startBook.order && rec.chapter_number < startChapter) return false;
            if (currentBook.order === endBook.order && rec.chapter_number > endChapter) return false;
            return true;
          });

          setRecords(filtered);
        }
      }
    } catch (err) {
      console.error('녹음 목록 조회 실패:', err);
      alert('녹음 목록을 가져오는 도중 에러가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // WAV writing helpers
  const writeString = (view: DataView, offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  const writeWavHeader = (view: DataView, offset: number, sampleRate: number, numChannels: number, numSamples: number) => {
    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + numSamples * 2, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numChannels * 2, true);
    view.setUint16(32, numChannels * 2, true);
    view.setUint16(34, 16, true);
    writeString(view, 36, 'data');
    view.setUint32(40, numSamples * 2, true);
  };

  // Audio merger logic
  const handleMergeAndDownload = async () => {
    if (records.length === 0) return;

    setMergeProgress(0);
    setMergeStatus('오디오 처리를 초기화하는 중...');

    try {
      const audioCtx = new AudioContext();
      const audioBuffers: AudioBuffer[] = [];
      const urls = records.map(r => r.audio_file);

      // 1. Fetch & Decode
      for (let i = 0; i < urls.length; i++) {
        setMergeStatus(`낭독 파일 로드 및 디코딩 중... (${i + 1}/${urls.length})`);
        setMergeProgress(Math.round(((i + 0.5) / urls.length) * 60));

        const response = await fetch(urls[i]);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
        audioBuffers.push(audioBuffer);
      }

      if (audioBuffers.length === 0) {
        throw new Error('재생 가능한 유효한 오디오 파일이 없습니다.');
      }

      setMergeStatus('오디오 조각 결합 중...');
      setMergeProgress(75);

      // 2. Concatenate channel data
      const sampleRate = audioBuffers[0].sampleRate;
      const numChannels = Math.max(...audioBuffers.map(b => b.numberOfChannels));
      const totalLength = audioBuffers.reduce((acc, buf) => acc + buf.length, 0);

      const mergedChannels: Float32Array[] = [];
      for (let c = 0; c < numChannels; c++) {
        mergedChannels.push(new Float32Array(totalLength));
      }

      let writeOffset = 0;
      for (const buf of audioBuffers) {
        for (let c = 0; c < numChannels; c++) {
          if (c < buf.numberOfChannels) {
            mergedChannels[c].set(buf.getChannelData(c), writeOffset);
          }
        }
        writeOffset += buf.length;
      }

      setMergeStatus('단일 WAV 파일로 변환 인코딩 중...');
      setMergeProgress(90);

      // 3. Int16 PCM encoding
      const wavBuffer = new ArrayBuffer(44 + totalLength * numChannels * 2);
      const view = new DataView(wavBuffer);

      writeWavHeader(view, 0, sampleRate, numChannels, totalLength * numChannels);

      let pos = 44;
      for (let i = 0; i < totalLength; i++) {
        for (let c = 0; c < numChannels; c++) {
          let sample = mergedChannels[c][i];
          sample = Math.max(-1, Math.min(1, sample));
          const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
          view.setInt16(pos, intSample, true);
          pos += 2;
        }
      }

      setMergeStatus('다운로드 준비 완료!');
      setMergeProgress(100);

      // 4. Trigger download
      const wavBlob = new Blob([wavBuffer], { type: 'audio/wav' });
      const downloadUrl = URL.createObjectURL(wavBlob);
      const link = document.createElement('a');
      link.href = downloadUrl;

      // 파일명 다형성 설정
      let filename = 'bible_recording.wav';
      if (downloadType === 'chapter') {
        const book = allBooksList.find(b => b.id === selectedBookId);
        filename = `${book?.name || '성경'}_${selectedChapter}장_낭독.wav`;
      } else if (downloadType === 'book') {
        const book = allBooksList.find(b => b.id === selectedBookId);
        filename = `${book?.name || '성경'}_전체_낭독.wav`;
      } else if (downloadType === 'range') {
        filename = '성경_지정구간_낭독.wav';
      }

      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);

      setTimeout(() => {
        setMergeProgress(-1);
        setMergeStatus('');
      }, 1500);

    } catch (err) {
      console.error('병합 다운로드 실패:', err);
      alert('오디오 파일 병합 중 에러가 발생했습니다. 개별 다운로드를 이용해 주세요.');
      setMergeProgress(-1);
      setMergeStatus('');
    }
  };

  // Estimate total file size (approx. 100KB per verse)
  const getEstimatedSize = () => {
    const sizeKb = records.length * 100;
    if (sizeKb < 1024) return `${sizeKb} KB`;
    return `${(sizeKb / 1024).toFixed(1)} MB`;
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>내 음성 녹음 다운로드</h1>
        <p>낭독한 성경 구절 녹음들을 한눈에 확인하고 오디오 파일로 묶어서 다운로드하세요.</p>
      </header>

      {/* Tabs */}
      <div className={styles.tabs}>
        {(['verse', 'chapter', 'book', 'range'] as const).map((type) => (
          <button
            key={type}
            className={`${styles.tab} ${downloadType === type ? styles.activeTab : ''}`}
            onClick={() => {
              setDownloadType(type);
              setRecords([]);
            }}
          >
            {type === 'verse' && '구절별'}
            {type === 'chapter' && '장별 병합'}
            {type === 'book' && '권별 병합'}
            {type === 'range' && '구간 지정 병합'}
          </button>
        ))}
      </div>

      {/* Filter Section */}
      <div className={styles.filtersCard}>
        <div className={styles.filtersGrid}>
          {(downloadType === 'verse' || downloadType === 'chapter' || downloadType === 'book') && (
            <div className={styles.filterGroup}>
              <label>성경 선택</label>
              <select value={selectedBookId} onChange={(e) => {
                setSelectedBookId(parseInt(e.target.value));
                setSelectedChapter(0);
                setRecords([]);
              }}>
                <option value={0}>-- 성경을 선택하세요 --</option>
                {allBooksList.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.testament === 'OT' ? '구약' : '신약'})
                  </option>
                ))}
              </select>
            </div>
          )}

          {(downloadType === 'verse' || downloadType === 'chapter') && (
            <div className={styles.filterGroup}>
              <label>장 선택</label>
              <select
                value={selectedChapter}
                onChange={(e) => setSelectedChapter(parseInt(e.target.value))}
                disabled={!selectedBookId}
              >
                <option value={0}>-- 장을 선택하세요 --</option>
                {chapters?.map((c) => (
                  <option key={c.id} value={c.number}>
                    {c.number}장
                  </option>
                ))}
              </select>
            </div>
          )}

          {downloadType === 'range' && (
            <>
              <div className={styles.filterGroup}>
                <label>시작 성경</label>
                <select value={startBookId} onChange={(e) => {
                  setStartBookId(parseInt(e.target.value));
                  setStartChapter(0);
                  setRecords([]);
                }}>
                  <option value={0}>-- 선택 --</option>
                  {allBooksList.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.filterGroup}>
                <label>시작 장</label>
                <select
                  value={startChapter}
                  onChange={(e) => setStartChapter(parseInt(e.target.value))}
                  disabled={!startBookId}
                >
                  <option value={0}>-- 장 --</option>
                  {startChapters?.map((c) => (
                    <option key={c.id} value={c.number}>
                      {c.number}장
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.filterGroup}>
                <label>종료 성경</label>
                <select value={endBookId} onChange={(e) => {
                  setEndBookId(parseInt(e.target.value));
                  setEndChapter(0);
                  setRecords([]);
                }}>
                  <option value={0}>-- 선택 --</option>
                  {allBooksList.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.filterGroup}>
                <label>종료 장</label>
                <select
                  value={endChapter}
                  onChange={(e) => setEndChapter(parseInt(e.target.value))}
                  disabled={!endBookId}
                >
                  <option value={0}>-- 장 --</option>
                  {endChapters?.map((c) => (
                    <option key={c.id} value={c.number}>
                      {c.number}장
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
        </div>

        <button onClick={handleSearch} disabled={isLoading} className={styles.searchBtn}>
          {isLoading ? <Loader2 className={styles.spinner} size={18} /> : '녹음 검색하기'}
        </button>
      </div>

      {/* Merge progress overlay */}
      {mergeProgress >= 0 && (
        <div className={styles.progressOverlay}>
          <div className={styles.progressCard}>
            <Loader2 className={styles.spinner} size={36} />
            <h3>오디오 병합 처리 중</h3>
            <p>{mergeStatus}</p>
            <div className={styles.progressBarBg}>
              <div className={styles.progressBarFill} style={{ width: `${mergeProgress}%` }}></div>
            </div>
            <span className={styles.percentText}>{mergeProgress}%</span>
          </div>
        </div>
      )}

      {/* Results View */}
      {records.length > 0 ? (
        <div className={styles.resultsCard}>
          <div className={styles.resultsSummary}>
            <div className={styles.summaryInfo}>
              <Info size={16} />
              <span>
                총 <strong>{records.length}개</strong>의 구절 녹음 발견 (예상 총 용량: {getEstimatedSize()})
              </span>
            </div>
            {downloadType !== 'verse' && (
              <button onClick={handleMergeAndDownload} className={styles.mergeDownloadBtn}>
                <Headphones size={18} />
                하나의 파일로 병합 다운로드
              </button>
            )}
          </div>

          <div className={styles.recordsList}>
            {records.map((rec) => (
              <div key={rec.id} className={styles.recordItem}>
                <div className={styles.recordDetails}>
                  <span className={styles.recordTitle}>
                    {rec.book_name} {rec.chapter_number}장 {rec.verse_number}절
                  </span>
                  <span className={styles.recordDate}>
                    {new Date(rec.created_at).toLocaleDateString()} 녹음됨
                  </span>
                </div>
                <a href={rec.audio_file} download className={styles.downloadIconBtn} title="개별 다운로드">
                  <Download size={18} />
                </a>
              </div>
            ))}
          </div>
        </div>
      ) : (
        !isLoading && (
          <div className={styles.emptyState}>
            <Info size={32} />
            <p>검색 조건에 매칭되는 내 음성 녹음 파일이 없습니다.</p>
            <span>성경 읽기 페이지에서 구절의 마이크 버튼을 눌러 먼저 녹음을 등록해 보세요.</span>
          </div>
        )
      )}
    </div>
  );
};

export default VoiceDownloadPage;
