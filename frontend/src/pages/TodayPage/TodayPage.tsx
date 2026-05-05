import React from 'react';
import { useRandomVerse } from '../../hooks/useBible';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import { Share2, RefreshCw } from 'lucide-react';
import styles from './TodayPage.module.css';

const TodayPage: React.FC = () => {
  const { data: verse, isLoading, refetch, isFetching } = useRandomVerse();

  const handleShare = async () => {
    if (!verse) return;
    const text = `[오늘의 말씀] ${verse.book_name} ${verse.chapter_number}:${verse.number}\n\n${verse.text}\n\n- Cafe the Bible -`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: '오늘의 말씀',
          text: text,
          url: window.location.href,
        });
      } catch (err) {
        console.error('공유 실패:', err);
      }
    } else {
      await navigator.clipboard.writeText(text);
      alert('클립보드에 복사되었습니다.');
    }
  };

  const todayStr = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <span className={styles.date}>{todayStr}</span>
        <h1 className={styles.title}>오늘의 말씀</h1>
      </header>

      {verse && (
        <div className={styles.card}>
          <div className={styles.quoteMark}>"</div>
          <p className={styles.text}>{verse.text}</p>
          <div className={styles.reference}>
            {verse.book_name} {verse.chapter_number}:{verse.number}
          </div>
          <div className={styles.actions}>
            <button onClick={handleShare} className={styles.shareBtn}>
              <Share2 size={20} />
              공유하기
            </button>
            <button onClick={() => refetch()} className={isFetching ? styles.spinning : ''}>
              <RefreshCw size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodayPage;
