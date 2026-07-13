import React from 'react';
import { Sun, Moon, Coffee } from 'lucide-react';
import { useReadingStore, Theme } from '../../store/readingStore';
import styles from './ThemeSelector.module.css';

const themes: { value: Theme; icon: React.ReactNode; label: string }[] = [
  { value: 'light', icon: <Sun size={16} />, label: '라이트' },
  { value: 'dark', icon: <Moon size={16} />, label: '다크' },
  { value: 'sepia', icon: <Coffee size={16} />, label: '세피아' },
];

const ThemeSelector: React.FC = () => {
  const { theme, setTheme } = useReadingStore();

  return (
    <div className={styles.container}>
      {themes.map((t) => (
        <button
          key={t.value}
          className={theme === t.value ? styles.activeBtn : styles.btn}
          onClick={() => setTheme(t.value)}
          title={t.label}
        >
          {t.icon}
          <span>{t.label}</span>
        </button>
      ))}
    </div>
  );
};

export default ThemeSelector;
