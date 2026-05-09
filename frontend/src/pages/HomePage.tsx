import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, CalendarDays, ChevronRight, NotebookPen } from 'lucide-react';
import { useBooks, useRandomVerse } from '../hooks/useBible';
import { useReadingStore } from '../store/readingStore';
import styles from './HomePage.module.css';

const HomePage: React.FC = () => {
  const { data: books, isLoading: booksLoading } = useBooks();
  const { data: todayVerse } = useRandomVerse();
  const { currentBookId, currentChapter, history, devotions } = useReadingStore();

  const allBooks = [...(books?.OT ?? []), ...(books?.NT ?? [])];
  const currentBook = allBooks.find((book) => book.id === currentBookId);
  const lastHistory = history[0];
  const lastHistoryBook = allBooks.find((book) => book.id === lastHistory?.bookId);
  const continueBookId = currentBookId ?? lastHistory?.bookId;
  const continueChapter = currentChapter ?? lastHistory?.chapter;
  const continueBookName = currentBook?.name ?? lastHistoryBook?.name;
  const devotionList = Object.values(devotions).sort((a, b) => b.updatedAt - a.updatedAt);
  const latestDevotion = devotionList[0];

  if (booksLoading) return <div className={styles.loading}>로딩 중...</div>;

  return (
    <div className={styles.container}>
      <section className={styles.focusGrid}>
        <Link to="/today" className={styles.primaryPanel}>
          <div className={styles.panelHeader}>
            <CalendarDays size={22} />
            <span>오늘의 말씀</span>
          </div>
          <p className={styles.verseText}>{todayVerse?.text ?? '오늘의 말씀을 불러오는 중입니다.'}</p>
          {todayVerse && (
            <span className={styles.reference}>
              {todayVerse.book_name} {todayVerse.chapter_number}:{todayVerse.number}
            </span>
          )}
        </Link>

        <div className={styles.sidePanels}>
          <Link
            to={continueBookId && continueChapter ? `/read/${continueBookId}/${continueChapter}/1` : '/read'}
            className={styles.actionPanel}
          >
            <div className={styles.panelHeader}>
              <BookOpen size={20} />
              <span>이어서 읽기</span>
            </div>
            <strong>
              {continueBookName && continueChapter
                ? `${continueBookName} ${continueChapter}장`
                : '성경 선택하기'}
            </strong>
            <ChevronRight size={20} />
          </Link>

          <Link to="/today" className={styles.actionPanel}>
            <div className={styles.panelHeader}>
              <NotebookPen size={20} />
              <span>최근 묵상</span>
            </div>
            <strong>{latestDevotion ? latestDevotion.reference : '오늘 묵상 작성하기'}</strong>
            <ChevronRight size={20} />
          </Link>
        </div>
      </section>

      <section>
        <h2 className={styles.title}>구약 성경</h2>
        <div className={styles.grid}>
          {books?.OT.map((book) => (
            <Link key={book.id} to={`/read/${book.id}`} className={styles.bookCard}>
              {book.name}
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.title}>신약 성경</h2>
        <div className={styles.grid}>
          {books?.NT.map((book) => (
            <Link key={book.id} to={`/read/${book.id}`} className={styles.bookCard}>
              {book.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
