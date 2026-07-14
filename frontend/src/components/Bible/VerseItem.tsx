import React, { useState, useRef, useEffect } from 'react';
import { Bookmark, Highlighter, Mic, Play, Pause, Trash2, Square, Loader2, RefreshCw } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { Verse } from '../../types/bible';
import { uploadVoiceRecord, deleteVoiceRecord } from '../../api/bible';
import HighlightPopover from './HighlightPopover';
import styles from './VerseItem.module.css';

interface VerseItemProps {
  verse: Verse;
  isBookmarked: boolean;
  onToggleBookmark: (id: number) => void;
  highlightColor?: string;
  onToggleHighlight: (verseId: number, color: string) => void;
  onRemoveHighlight: (verseId: number) => void;
}

const VerseItem: React.FC<VerseItemProps> = ({
  verse,
  isBookmarked,
  onToggleBookmark,
  highlightColor,
  onToggleHighlight,
  onRemoveHighlight,
}) => {
  const queryClient = useQueryClient();
  const [showPopover, setShowPopover] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Component cleanup
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // Update playing state if recording changes
  useEffect(() => {
    if (isPlaying && audioRef.current && verse.voice_record) {
      if (audioRef.current.src !== verse.voice_record.audio_file) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [verse.voice_record, isPlaying]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];

      let mimeType = 'audio/webm';
      if (MediaRecorder.isTypeSupported('audio/mp4')) {
        mimeType = 'audio/mp4';
      } else if (MediaRecorder.isTypeSupported('audio/ogg')) {
        mimeType = 'audio/ogg';
      }

      const options = MediaRecorder.isTypeSupported(mimeType) ? { mimeType } : undefined;
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        stream.getTracks().forEach((track) => track.stop());

        setIsUploading(true);
        try {
          await uploadVoiceRecord(verse.id, audioBlob);
          queryClient.invalidateQueries({ queryKey: ['verses', verse.book_id, verse.chapter_number] });
        } catch (error) {
          console.error('녹음 업로드 실패:', error);
          alert('녹음 저장에 실패했습니다. 다시 시도해 주세요.');
        } finally {
          setIsUploading(false);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = window.setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

    } catch (err) {
      console.error('마이크 접근 실패:', err);
      alert('마이크 권한이 필요합니다. 설정에서 권한을 승인해 주세요.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const handleDelete = async () => {
    if (!verse.voice_record) return;
    if (!window.confirm('정말 이 녹음을 삭제하시겠습니까?')) return;

    setIsDeleting(true);
    try {
      await deleteVoiceRecord(verse.voice_record.id);
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      }
      queryClient.invalidateQueries({ queryKey: ['verses', verse.book_id, verse.chapter_number] });
    } catch (error) {
      console.error('녹음 삭제 실패:', error);
      alert('녹음 삭제에 실패했습니다.');
    } finally {
      setIsDeleting(false);
    }
  };

  const togglePlay = () => {
    if (!verse.voice_record) return;

    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      if (!audioRef.current) {
        audioRef.current = new Audio(verse.voice_record.audio_file);
        audioRef.current.onended = () => {
          setIsPlaying(false);
        };
      } else if (audioRef.current.src !== verse.voice_record.audio_file) {
        audioRef.current.src = verse.voice_record.audio_file;
      }
      audioRef.current.play().catch((err) => {
        console.error('오디오 재생 실패:', err);
        setIsPlaying(false);
      });
      setIsPlaying(true);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={styles.container} id={`verse-${verse.number}`}>
      <div className={styles.header}>
        <div className={styles.leftHeader}>
          <span className={styles.number}>{verse.number}</span>
          {/* Audio Controls */}
          {isUploading ? (
            <span className={styles.loader}><Loader2 size={14} className={styles.spinner} /></span>
          ) : isRecording ? (
            <div className={styles.recordingIndicator}>
              <span className={styles.time}>{formatTime(recordingTime)}</span>
              <button onClick={stopRecording} className={styles.stopBtn} title="녹음 정지">
                <Square size={10} fill="currentColor" />
              </button>
            </div>
          ) : verse.voice_record ? (
            <div className={styles.audioControls}>
              <button onClick={togglePlay} className={styles.playBtn} title={isPlaying ? "일시정지" : "재생"}>
                {isPlaying ? <Pause size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" />}
              </button>
              <button onClick={startRecording} className={styles.recordBtn} title="다시 녹음">
                <RefreshCw size={12} />
              </button>
              <button onClick={handleDelete} disabled={isDeleting} className={styles.deleteBtn} title="녹음 삭제">
                <Trash2 size={12} />
              </button>
            </div>
          ) : (
            <button onClick={startRecording} className={styles.recordBtn} title="구절 녹음">
              <Mic size={14} />
            </button>
          )}
        </div>

        <div className={styles.actions}>
          {/* Highlight and Bookmark */}
          <div className={styles.popoverAnchor}>
            <button
              className={highlightColor ? styles.highlightActive : styles.highlight}
              onClick={(e) => {
                e.stopPropagation();
                setShowPopover(!showPopover);
              }}
              aria-label="하이라이트"
            >
              <Highlighter size={16} />
            </button>
            {showPopover && (
              <HighlightPopover
                verseId={verse.id}
                currentColor={highlightColor}
                onSelect={onToggleHighlight}
                onRemove={onRemoveHighlight}
                onClose={() => setShowPopover(false)}
              />
            )}
          </div>
          <button
            className={isBookmarked ? styles.bookmarkActive : styles.bookmark}
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark(verse.id);
            }}
          >
            <Bookmark size={18} fill={isBookmarked ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>
      <p
        className={styles.text}
        style={highlightColor ? { backgroundColor: highlightColor, borderRadius: '4px', padding: '2px 4px' } : undefined}
      >
        {verse.text}
      </p>
    </div>
  );
};

export default VerseItem;
