import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBooks, useChapters, useVerses } from '../../hooks/useBible';
import { useReadingStore, FontSize } from '../../store/readingStore';
import BookSelector from '../../components/Bible/BookSelector';
import ChapterSelector from '../../components/Bible/ChapterSelector';
import VerseSelector from '../../components/Bible/VerseSelector';
import VerseList from '../../components/Bible/VerseList';
import Skeleton from '../../components/Common/Skeleton';
import { ChevronLeft, ChevronRight, Settings, AlertCircle, ArrowLeft, Headphones, Play, Pause } from 'lucide-react';
import styles from './ReadingPage.module.css';

const ReadingPageSkeleton: React.FC = () => (
  <div className={styles.container}>
    <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
      <Skeleton width="100px" height="40px" borderRadius="20px" />
      <Skeleton width="100px" height="40px" borderRadius="20px" />
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '1rem' }}>
      {Array(20).fill(0).map((_, i) => (
        <Skeleton key={i} height="50px" />
      ))}
    </div>
  </div>
);

const ReadingPage: React.FC = () => {
  const { bookId, chapter, verse } = useParams<{ bookId: string; chapter: string; verse: string }>();
  const navigate = useNavigate();
  const { fontSize, setFontSize, setReading } = useReadingStore();
  const [showSettings, setShowSettings] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: books, isLoading: booksLoading, error: booksError } = useBooks();
  const selectedBookId = bookId ? parseInt(bookId) : null;
  const { data: chapters, error: chaptersError } = useChapters(selectedBookId || 0);
  
  const currentChapter = chapter ? parseInt(chapter) : null;
  const currentVerse = verse ? parseInt(verse) : null;
  const { data: verses, isLoading: versesLoading, error: versesError } = useVerses(selectedBookId || 0, currentChapter || 0);

  const [playQueue, setPlayQueue] = useState<{ url: string; verseNumber: number; text: string }[]>([]);
  const [currentQueueIndex, setCurrentQueueIndex] = useState<number>(-1);
  const [isQueuePlaying, setIsQueuePlaying] = useState<boolean>(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const queueAudioRef = useRef<HTMLAudioElement | null>(null);

  const startContinuousPlayback = () => {
    if (!verses) return;
    const queue = verses
      .filter((v) => v.voice_record !== null)
      .map((v) => ({
        url: v.voice_record!.audio_file,
        verseNumber: v.number,
        text: v.text,
      }));

    if (queue.length === 0) {
      alert('이 장에 녹음된 음성이 없습니다. 먼저 구절별로 음성을 녹음해 보세요!');
      return;
    }

    setPlayQueue(queue);
    setCurrentQueueIndex(0);
    setIsQueuePlaying(true);
    setIsAudioPlaying(true);
  };

  const stopContinuousPlayback = () => {
    if (queueAudioRef.current) {
      queueAudioRef.current.pause();
      queueAudioRef.current = null;
    }
    setIsQueuePlaying(false);
    setIsAudioPlaying(false);
    setCurrentQueueIndex(-1);
    setPlayQueue([]);
  };

  const toggleQueuePlay = () => {
    if (!queueAudioRef.current) return;
    if (queueAudioRef.current.paused) {
      queueAudioRef.current.play().catch(console.error);
      setIsAudioPlaying(true);
    } else {
      queueAudioRef.current.pause();
      setIsAudioPlaying(false);
    }
  };

  const handlePrevQueue = () => {
    if (currentQueueIndex > 0) {
      setCurrentQueueIndex((prev) => prev - 1);
      setIsAudioPlaying(true);
    }
  };

  const handleNextQueue = () => {
    if (currentQueueIndex < playQueue.length - 1) {
      setCurrentQueueIndex((prev) => prev + 1);
      setIsAudioPlaying(true);
    }
  };

  useEffect(() => {
    if (!isQueuePlaying || currentQueueIndex < 0 || currentQueueIndex >= playQueue.length) {
      return;
    }

    const currentItem = playQueue[currentQueueIndex];

    if (queueAudioRef.current) {
      queueAudioRef.current.pause();
    }

    const audio = new Audio(currentItem.url);
    queueAudioRef.current = audio;

    audio.onended = () => {
      if (currentQueueIndex + 1 >= playQueue.length) {
        stopContinuousPlayback();
      } else {
        setCurrentQueueIndex((prev) => prev + 1);
      }
    };

    audio.onerror = () => {
      if (currentQueueIndex + 1 >= playQueue.length) {
        stopContinuousPlayback();
      } else {
        setCurrentQueueIndex((prev) => prev + 1);
      }
    };

    audio.play()
      .then(() => {
        setIsAudioPlaying(true);
      })
      .catch((err) => {
        console.error('연속 재생 플레이 실패:', err);
        if (currentQueueIndex + 1 >= playQueue.length) {
          stopContinuousPlayback();
        } else {
          setCurrentQueueIndex((prev) => prev + 1);
        }
      });

  }, [currentQueueIndex, isQueuePlaying, playQueue]);

  useEffect(() => {
    return () => {
      if (queueAudioRef.current) {
        queueAudioRef.current.pause();
      }
    };
  }, [bookId, chapter]);

  useEffect(() => {
    if (currentVerse && verses && containerRef.current) {
      // Small delay to ensure DOM is rendered
      setTimeout(() => {
        const element = document.getElementById(`verse-${currentVerse}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  }, [currentVerse, verses]);

  useEffect(() => {
    if (selectedBookId && currentChapter && currentVerse) {
      setReading(selectedBookId, currentChapter);
    }
  }, [selectedBookId, currentChapter, currentVerse, setReading]);

  const handleBookSelect = (id: number) => {
    navigate(`/read/${id}`);
  };

  const handleChapterSelect = (num: number) => {
    navigate(`/read/${bookId}/${num}`);
  };

  const handleVerseSelect = (num: number) => {
    navigate(`/read/${bookId}/${chapter}/${num}`);
  };

  const navigateChapter = (direction: 'prev' | 'next') => {
    if (!currentChapter || !chapters) return;
    const newChapter = direction === 'prev' ? currentChapter - 1 : currentChapter + 1;
    if (newChapter >= 1 && newChapter <= chapters.length) {
      navigate(`/read/${bookId}/${newChapter}/1`);
    }
  };

  if (booksError || chaptersError || versesError) {
    return (
      <div className={styles.errorContainer}>
        <AlertCircle size={48} color="var(--color-error)" />
        <h2>데이터를 불러오지 못했습니다</h2>
        <p>서버 연결 상태를 확인하거나 잠시 후 다시 시도해주세요.</p>
        <button onClick={() => window.location.reload()}>다시 시도</button>
      </div>
    );
  }

  if (booksLoading || (selectedBookId && currentChapter && versesLoading)) {
    return <ReadingPageSkeleton />;
  }

  // Book Selection Phase
  if (!selectedBookId && books) {
    return (
      <div className={styles.container}>
        <header className={styles.selectionHeader}>
          <h1>성경 선택</h1>
        </header>
        <BookSelector books={books} onSelect={handleBookSelect} />
      </div>
    );
  }

  // Chapter Selection Phase
  if (selectedBookId && !currentChapter && chapters) {
    const selectedBook = books?.OT.find(b => b.id === selectedBookId) || books?.NT.find(b => b.id === selectedBookId);
    return (
      <div className={styles.container}>
        <header className={styles.selectionHeader}>
          <button className={styles.backBtn} onClick={() => navigate('/read')}>
            <ArrowLeft size={20} />
          </button>
          <h1>{selectedBook?.name} - 장 선택</h1>
        </header>
        <ChapterSelector chapters={chapters} onSelect={handleChapterSelect} />
      </div>
    );
  }

  // Verse Selection Phase (Optional intermediate step)
  // If chapter is selected but verse is not, we show verse selector
  // OR we can just show the whole chapter. The user asked for "Book -> Chapter -> Verse selection flow"
  if (selectedBookId && currentChapter && !currentVerse && verses) {
    return (
      <div className={styles.container}>
        <header className={styles.selectionHeader}>
          <button className={styles.backBtn} onClick={() => navigate(`/read/${bookId}`)}>
            <ArrowLeft size={20} />
          </button>
          <h1>{verses[0]?.book_name} {currentChapter}장 - 절 선택</h1>
        </header>
        <VerseSelector verses={verses} onSelect={handleVerseSelect} />
        <div className={styles.fullChapterBtnContainer}>
          <button className={styles.fullChapterBtn} onClick={() => navigate(`/read/${bookId}/${chapter}/1`)}>
            1절부터 읽기
          </button>
        </div>
      </div>
    );
  }

  // Reading Phase
  return (
    <div className={`${styles.container} ${styles[fontSize]}`} ref={containerRef}>
      {verses && (
        <div className={styles.reader}>
          <header className={styles.header}>
            <button onClick={() => navigate(`/read/${bookId}/${currentChapter}`)} className={styles.title}>
              {verses[0]?.book_name} {currentChapter}장 {currentVerse ? `${currentVerse}절` : ''}
            </button>
            <div className={styles.headerActions}>
              <button onClick={startContinuousPlayback} className={styles.audioBtn} title="이 장 낭독 연속 재생">
                <Headphones size={20} />
              </button>
              <button onClick={() => setShowSettings(!showSettings)} className={styles.settingsBtn}>
                <Settings size={20} />
              </button>
            </div>
          </header>

          {showSettings && (
            <div className={styles.settingsPanel}>
              <span>글자 크기:</span>
              {(['small', 'medium', 'large'] as FontSize[]).map((size) => (
                <button
                  key={size}
                  className={fontSize === size ? styles.activeSize : ''}
                  onClick={() => setFontSize(size)}
                >
                  {size === 'small' ? '작게' : size === 'medium' ? '보통' : '크게'}
                </button>
              ))}
            </div>
          )}

          <VerseList verses={verses} />

          <footer className={styles.navFooter}>
            <button onClick={() => navigateChapter('prev')} disabled={currentChapter === 1}>
              <ChevronLeft /> 이전 장
            </button>
            <button onClick={() => navigateChapter('next')} disabled={chapters && currentChapter === chapters.length}>
              다음 장 <ChevronRight />
            </button>
          </footer>

          {/* 연속 재생 플레이어 바 */}
          {playQueue.length > 0 && currentQueueIndex >= 0 && currentQueueIndex < playQueue.length && (
            <div className={styles.playerBar}>
              <div className={styles.playerInfo}>
                <span className={styles.playerTitle}>
                  {verses?.[0]?.book_name} {currentChapter}장 {playQueue[currentQueueIndex].verseNumber}절 낭독 중
                </span>
                <p className={styles.playerText}>{playQueue[currentQueueIndex].text}</p>
              </div>
              <div className={styles.playerControls}>
                <button onClick={handlePrevQueue} disabled={currentQueueIndex === 0} className={styles.playerBtn}>
                  <ChevronLeft size={20} />
                </button>
                <button onClick={toggleQueuePlay} className={styles.playerPlayBtn}>
                  {isQueuePlaying && isAudioPlaying ? (
                    <Pause size={20} fill="currentColor" />
                  ) : (
                    <Play size={20} fill="currentColor" />
                  )}
                </button>
                <button onClick={handleNextQueue} disabled={currentQueueIndex === playQueue.length - 1} className={styles.playerBtn}>
                  <ChevronRight size={20} />
                </button>
                <button onClick={stopContinuousPlayback} className={styles.playerCloseBtn}>
                  닫기
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReadingPage;
