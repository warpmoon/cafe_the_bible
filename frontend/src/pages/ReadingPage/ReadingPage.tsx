import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBooks, useChapters, useVerses } from '../../hooks/useBible';
import { useReadingStore, FontSize } from '../../store/readingStore';
import BookSelector from '../../components/Bible/BookSelector';
import ChapterSelector from '../../components/Bible/ChapterSelector';
import VerseList from '../../components/Bible/VerseList';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import { ChevronLeft, ChevronRight, Settings } from 'lucide-react';
import styles from './ReadingPage.module.css';

const ReadingPage: React.FC = () => {
  const { bookId, chapter } = useParams<{ bookId: string; chapter: string }>();
  const navigate = useNavigate();
  const { fontSize, setFontSize } = useReadingStore();
  const [showSettings, setShowSettings] = useState(false);

  const { data: books, isLoading: booksLoading } = useBooks();
  const selectedBookId = bookId ? parseInt(bookId) : null;
  const { data: chapters, isLoading: chaptersLoading } = useChapters(selectedBookId || 0);
  
  const currentChapter = chapter ? parseInt(chapter) : null;
  const { data: verses, isLoading: versesLoading } = useVerses(selectedBookId || 0, currentChapter || 0);

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

  if (booksLoading) return <LoadingSpinner />;

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
