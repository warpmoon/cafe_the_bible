import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBooks, useChapters, useVerses } from '../../hooks/useBible';
import { useReadingStore, FontSize } from '../../store/readingStore';
import BookSelector from '../../components/Bible/BookSelector';
import ChapterSelector from '../../components/Bible/ChapterSelector';
import VerseList from '../../components/Bible/VerseList';
import Skeleton from '../../components/Common/Skeleton';
import { ChevronLeft, ChevronRight, Settings, AlertCircle } from 'lucide-react';
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
  const { bookId, chapter } = useParams<{ bookId: string; chapter: string }>();
  const navigate = useNavigate();
  const { fontSize, setFontSize } = useReadingStore();
  const [showSettings, setShowSettings] = useState(false);

  const { data: books, isLoading: booksLoading, error: booksError } = useBooks();
  const selectedBookId = bookId ? parseInt(bookId) : null;
  const { data: chapters, error: chaptersError } = useChapters(selectedBookId || 0);
  
  const currentChapter = chapter ? parseInt(chapter) : null;
  const { data: verses, isLoading: versesLoading, error: versesError } = useVerses(selectedBookId || 0, currentChapter || 0);

  const handleBookSelect = (id: number) => {
    navigate(`/read/${id}/1`);
  };

  const handleChapterSelect = (num: number) => {
    navigate(`/read/${bookId}/${num}`);
  };

  const navigateChapter = (direction: 'prev' | 'next') => {
    if (!currentChapter || !chapters) return;
    const newChapter = direction === 'prev' ? currentChapter - 1 : currentChapter + 1;
    if (newChapter >= 1 && newChapter <= chapters.length) {
      navigate(`/read/${bookId}/${newChapter}`);
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

  return (
    <div className={`${styles.container} ${styles[fontSize]}`}>
      {!selectedBookId && books && (
        <BookSelector books={books} onSelect={handleBookSelect} />
      )}

      {selectedBookId && !currentChapter && chapters && (
        <>
          <button className={styles.backBtn} onClick={() => navigate('/read')}>&larr; 책 선택</button>
          <ChapterSelector chapters={chapters} onSelect={handleChapterSelect} />
        </>
      )}

      {selectedBookId && currentChapter && verses && (
        <div className={styles.reader}>
          <header className={styles.header}>
            <button onClick={() => navigate('/read')} className={styles.title}>
              {verses[0]?.book_name} {currentChapter}장
            </button>
            <button onClick={() => setShowSettings(!showSettings)} className={styles.settingsBtn}>
              <Settings size={20} />
            </button>
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
        </div>
      )}
    </div>
  );
};

export default ReadingPage;
