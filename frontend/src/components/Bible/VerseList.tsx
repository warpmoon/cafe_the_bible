import React from 'react';
import { Verse } from '../../types/bible';
import VerseItem from './VerseItem';
import { useReadingStore } from '../../store/readingStore';
import styles from './VerseList.module.css';

interface VerseListProps {
  verses: Verse[];
}

const VerseList: React.FC<VerseListProps> = ({ verses }) => {
  const { bookmarks, toggleBookmark } = useReadingStore();

  return (
    <div className={styles.container}>
      {verses.map((verse) => (
        <VerseItem
          key={verse.id}
          verse={verse}
          isBookmarked={bookmarks.includes(verse.id)}
          onToggleBookmark={toggleBookmark}
        />
      ))}
    </div>
  );
};

export default VerseList;
