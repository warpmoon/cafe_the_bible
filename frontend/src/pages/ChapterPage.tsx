import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getChapters } from '../api';
import styles from './ChapterPage.module.css';

const ChapterPage: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const [chapters, setChapters] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (bookId) {
      getChapters(parseInt(bookId)).then((res) => {
        setChapters(res.data);
        setLoading(false);
      });
    }
  }, [bookId]);

  if (loading) return <div>로딩 중...</div>;

  return (
    <div className={styles.container}>
      <Link to="/" className={styles.backButton}>&larr; 목록으로</Link>
      <h2 className={styles.title}>장 선택</h2>
      <div className={styles.grid}>
        {chapters.map((chapter) => (
          <Link
            key={chapter}
            to={`/book/${bookId}/chapter/${chapter}`}
            className={styles.chapterCard}
          >
            {chapter}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ChapterPage;
