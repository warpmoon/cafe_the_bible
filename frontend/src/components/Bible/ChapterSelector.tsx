import React from 'react';
import { Chapter } from '../../types/bible';
import styles from './ChapterSelector.module.css';

interface ChapterSelectorProps {
  chapters: Chapter[];
  onSelect: (chapterNum: number) => void;
}

const ChapterSelector: React.FC<ChapterSelectorProps> = ({ chapters, onSelect }) => {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>장 선택</h3>
      <div className={styles.grid}>
        {chapters.map((chapter) => (
          <button
            key={chapter.id}
            className={styles.chapterItem}
            onClick={() => onSelect(chapter.number)}
          >
            {chapter.number}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChapterSelector;
