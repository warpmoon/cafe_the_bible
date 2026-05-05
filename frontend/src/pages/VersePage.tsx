import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getVerses } from '../api';
import styles from './VersePage.module.css';

interface Verse {
  id: number;
  book_name: string;
  book_abbr: string;
  chapter: number;
  verse_num: number;
  content: string;
}

const VersePage: React.FC = () => {
  const { bookId, chapter } = useParams<{ bookId: string; chapter: string }>();
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (bookId && chapter) {
      getVerses(parseInt(bookId), parseInt(chapter)).then((res) => {
        setVerses(res.data);
        setLoading(false);
      });
    }
  }, [bookId, chapter]);

  if (loading) return <div>로딩 중...</div>;

  const bookName = verses.length > 0 ? verses[0].book_name : '';

  return (
    <div className={styles.container}>
      <div className={styles.navigation}>
        <Link to={`/book/${bookId}`} className={styles.backButton}>&larr; 장 선택으로</Link>
      </div>
      <h2 className={styles.title}>{bookName} {chapter}장</h2>
      <div className={styles.verseList}>
        {verses.map((verse) => (
          <div key={verse.id} className={styles.verseItem}>
            <span className={styles.verseNum}>{verse.verse_num}</span>
            <span className={styles.verseContent}>{verse.content}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VersePage;
