import React, { useState } from 'react';
import { Book as BookType } from '../../types/bible';
import styles from './BookSelector.module.css';

interface BookSelectorProps {
  books: { OT: BookType[]; NT: BookType[] };
  onSelect: (bookId: number) => void;
}

const BookSelector: React.FC<BookSelectorProps> = ({ books, onSelect }) => {
  const [tab, setTab] = useState<'OT' | 'NT'>('OT');

  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        <button
          className={tab === 'OT' ? styles.activeTab : styles.tab}
          onClick={() => setTab('OT')}
        >
          구약 성경
        </button>
        <button
          className={tab === 'NT' ? styles.activeTab : styles.tab}
          onClick={() => setTab('NT')}
        >
          신약 성경
        </button>
      </div>
      <div className={styles.grid}>
        {books[tab].map((book) => (
          <button
            key={book.id}
            className={styles.bookItem}
            onClick={() => onSelect(book.id)}
          >
            {book.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BookSelector;
