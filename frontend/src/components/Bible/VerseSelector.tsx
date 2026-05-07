import React from 'react';
import { Verse } from '../../types/bible';
import styles from './VerseSelector.module.css';

interface VerseSelectorProps {
  verses: Verse[];
  onSelect: (verseNum: number) => void;
}

const VerseSelector: React.FC<VerseSelectorProps> = ({ verses, onSelect }) => {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>절 선택</h3>
      <div className={styles.grid}>
        {verses.map((verse) => (
          <button
            key={verse.id}
            className={styles.verseItem}
            onClick={() => onSelect(verse.number)}
          >
            {verse.number}
          </button>
        ))}
      </div>
    </div>
  );
};

export default VerseSelector;
