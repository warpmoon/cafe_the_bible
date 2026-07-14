import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Settings, Download } from 'lucide-react';
import { useReadingStore, FontSize } from '../../store/readingStore';
import ThemeSelector from './ThemeSelector';
import styles from './MobileHeader.module.css';

const MobileHeader: React.FC = () => {
  const [showSettings, setShowSettings] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);
  const { fontSize, setFontSize } = useReadingStore();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setShowSettings(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logo} onClick={() => setShowSettings(false)}>
        Cafe the Bible
      </Link>
      <div className={styles.actions}>
        <Link to="/search" className={styles.actionBtn} title="검색" aria-label="검색 페이지 이동" onClick={() => setShowSettings(false)}>
          <Search size={22} />
        </Link>
        <div className={styles.settingsWrapper} ref={settingsRef}>
          <button
            className={`${styles.actionBtn} ${showSettings ? styles.activeBtn : ''}`}
            onClick={() => setShowSettings(!showSettings)}
            title="설정"
            aria-label="설정 메뉴 열기"
          >
            <Settings size={22} />
          </button>
          
          {showSettings && (
            <div className={styles.popover}>
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>테마 모드</h3>
                <ThemeSelector />
              </div>
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>글자 크기</h3>
                <div className={styles.fontSizeOptions}>
                  {(['small', 'medium', 'large'] as FontSize[]).map((size) => (
                    <button
                      key={size}
                      className={`${styles.sizeBtn} ${fontSize === size ? styles.activeSize : ''}`}
                      onClick={() => setFontSize(size)}
                    >
                      {size === 'small' ? '작게' : size === 'medium' ? '보통' : '크게'}
                    </button>
                  ))}
                </div>
              </div>
              <div className={styles.downloadSection}>
                <Link to="/downloads" className={styles.downloadLink} onClick={() => setShowSettings(false)}>
                  <Download size={16} />
                  <span>내 음성 다운로드</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default MobileHeader;
