import React from 'react';
import { Bookmark } from 'lucide-react';
import { Verse } from '../../types/bible';
import styles from './VerseItem.module.css';

interface VerseItemProps {
  verse: Verse;
  isBookmarked: boolean;
  onToggleBookmark: (id: number) => void;
}

const VerseItem: React.FC<VerseItemProps> = ({ verse, isBookmarked, onToggleBookmark }) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.number}>{verse.number}</span>
        <button
          className={isBookmarked ? styles.bookmarkActive : styles.bookmark}
          onClick={() => onToggleBookmark(verse.id)}
        >
          <Bookmark size={18} fill={isBookmarked ? 'currentColor' : 'none'} />
        </button>
      </div>
      <p className={styles.text}>{verse.text}</p>
    </div>
  );
};

export default VerseItem;
