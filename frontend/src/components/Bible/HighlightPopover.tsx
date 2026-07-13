import React, { useEffect, useRef } from 'react';
import { Eraser } from 'lucide-react';
import styles from './HighlightPopover.module.css';

const HIGHLIGHT_COLORS = [
  { name: '노랑', value: '#fff3a3' },
  { name: '초록', value: '#b8f0b8' },
  { name: '파랑', value: '#b8d4f0' },
  { name: '분홍', value: '#f0b8d4' },
  { name: '보라', value: '#d4b8f0' },
];

interface HighlightPopoverProps {
  verseId: number;
  currentColor: string | undefined;
  onSelect: (verseId: number, color: string) => void;
  onRemove: (verseId: number) => void;
  onClose: () => void;
}

const HighlightPopover: React.FC<HighlightPopoverProps> = ({
  verseId,
  currentColor,
  onSelect,
  onRemove,
  onClose,
}) => {
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div className={styles.popover} ref={popoverRef}>
      <div className={styles.colors}>
        {HIGHLIGHT_COLORS.map((color) => (
          <button
            key={color.value}
            className={styles.colorBtn}
            style={{ backgroundColor: color.value }}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(verseId, color.value);
              onClose();
            }}
            title={color.name}
            aria-label={`${color.name} 하이라이트`}
          >
            {currentColor === color.value && <span className={styles.check}>✓</span>}
          </button>
        ))}
        {currentColor && (
          <button
            className={styles.eraseBtn}
            onClick={(e) => {
              e.stopPropagation();
              onRemove(verseId);
              onClose();
            }}
            title="하이라이트 제거"
            aria-label="하이라이트 제거"
          >
            <Eraser size={14} />
          </button>
        )}
      </div>
    </div>
  );
};

export default HighlightPopover;
