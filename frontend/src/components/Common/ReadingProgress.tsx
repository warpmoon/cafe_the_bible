import React, { useMemo } from 'react';
import { BookOpen, Flame, TrendingUp } from 'lucide-react';
import { useReadingStore } from '../../store/readingStore';
import styles from './ReadingProgress.module.css';

const ReadingProgress: React.FC = () => {
  const { history } = useReadingStore();

  const stats = useMemo(() => {
    const uniqueChapters = new Set(
      history.map((h) => `${h.bookId}-${h.chapter}`)
    );

    const uniqueBooks = new Set(history.map((h) => h.bookId));

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let streak = 0;
    const dayMs = 86400000;

    const readingDates = [
      ...new Set(
        history.map((h) => {
          const d = new Date(h.timestamp);
          d.setHours(0, 0, 0, 0);
          return d.getTime();
        })
      ),
    ].sort((a, b) => b - a);

    if (readingDates.length > 0) {
      const mostRecent = readingDates[0];
      if (mostRecent >= today.getTime() - dayMs) {
        streak = 1;
        for (let i = 1; i < readingDates.length; i++) {
          if (readingDates[i] >= readingDates[i - 1] - dayMs - 1000) {
            streak++;
          } else {
            break;
          }
        }
      }
    }

    return {
      chaptersRead: uniqueChapters.size,
      booksRead: uniqueBooks.size,
      streak,
    };
  }, [history]);

  if (history.length === 0) return null;

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>읽기 현황</h2>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <BookOpen size={20} />
          </div>
          <strong className={styles.statValue}>{stats.chaptersRead}</strong>
          <span className={styles.statLabel}>읽은 장</span>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <TrendingUp size={20} />
          </div>
          <strong className={styles.statValue}>{stats.booksRead}</strong>
          <span className={styles.statLabel}>읽은 책</span>
        </div>
        <div className={`${styles.statCard} ${stats.streak > 0 ? styles.streakActive : ''}`}>
          <div className={styles.statIcon}>
            <Flame size={20} />
          </div>
          <strong className={styles.statValue}>{stats.streak}</strong>
          <span className={styles.statLabel}>연속 일</span>
        </div>
      </div>
    </section>
  );
};

export default ReadingProgress;
