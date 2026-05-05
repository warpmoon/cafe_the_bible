import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getBooks } from '../api';
import styles from './HomePage.module.css';

interface Book {
  id: number;
  name: string;
  abbreviation: string;
  testament: string;
}

const HomePage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBooks().then((res) => {
      setBooks(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div>로딩 중...</div>;

  const otBooks = books.filter(b => b.testament === 'OT');
  const ntBooks = books.filter(b => b.testament === 'NT');

  return (
    <div className={styles.container}>
      <section>
        <h2 className={styles.title}>구약 성경</h2>
        <div className={styles.grid}>
          {otBooks.map((book) => (
            <Link key={book.id} to={`/book/${book.id}`} className={styles.bookCard}>
              {book.name}
            </Link>
          ))}
        </div>
      </section>
      <section className={styles.section}>
        <h2 className={styles.title}>신약 성경</h2>
        <div className={styles.grid}>
          {ntBooks.map((book) => (
            <Link key={book.id} to={`/book/${book.id}`} className={styles.bookCard}>
              {book.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
