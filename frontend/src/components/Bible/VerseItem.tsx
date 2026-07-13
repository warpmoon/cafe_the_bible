import React, { useState } from 'react';
import { Bookmark, Highlighter } from 'lucide-react';
import { Verse } from '../../types/bible';
import HighlightPopover from './HighlightPopover';
import styles from './VerseItem.module.css';

interface VerseItemProps {
  verse: Verse;
  isBookmarked: boolean;
  onToggleBookmark: (id: number) => void;
  highlightColor?: string;
  onToggleHighlight: (verseId: number, color: string) => void;
  onRemoveHighlight: (verseId: number) => void;
}

const VerseItem: React.FC<VerseItemProps> = ({
  verse,
  isBookmarked,
  onToggleBookmark,
  highlightColor,
  onToggleHighlight,
  onRemoveHighlight,
}) => {
  const [showPopover, setShowPopover] = useState(false);

  return (
    <div className={styles.container} id={`verse-${verse.number}`}>
      <div className={styles.header}>
        <span className={styles.number}>{verse.number}</span>
        <div className={styles.actions}>
          <div className={styles.popoverAnchor}>
            <button
              className={highlightColor ? styles.highlightActive : styles.highlight}
              onClick={(e) => {
                e.stopPropagation();
                setShowPopover(!showPopover);
              }}
              aria-label="하이라이트"
            >
              <Highlighter size={16} />
            </button>
            {showPopover && (
              <HighlightPopover
                verseId={verse.id}
                currentColor={highlightColor}
                onSelect={onToggleHighlight}
                onRemove={onRemoveHighlight}
                onClose={() => setShowPopover(false)}
              />
            )}
          </div>
          <button
            className={isBookmarked ? styles.bookmarkActive : styles.bookmark}
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark(verse.id);
            }}
          >
            <Bookmark size={18} fill={isBookmarked ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>
      <p
        className={styles.text}
        style={highlightColor ? { backgroundColor: highlightColor, borderRadius: '4px', padding: '2px 4px' } : undefined}
      >
        {verse.text}
      </p>
    </div>
  );
};

export default VerseItem;
