import React from 'react';
import { NavLink } from 'react-router-dom';
import { BookOpen, Search, Bookmark, Calendar, Sun, Moon } from 'lucide-react';
import { useReadingStore } from '../../store/readingStore';
import styles from './BottomTabBar.module.css';

const BottomTabBar: React.FC = () => {
  const { theme, toggleTheme } = useReadingStore();

  return (
    <nav className={styles.nav}>
      <NavLink to="/" className={({ isActive }) => isActive ? styles.activeItem : styles.item}>
        <BookOpen size={24} />
        <span>읽기</span>
      </NavLink>
      <NavLink to="/search" className={({ isActive }) => isActive ? styles.activeItem : styles.item}>
        <Search size={24} />
        <span>검색</span>
      </NavLink>
      <NavLink to="/bookmarks" className={({ isActive }) => isActive ? styles.activeItem : styles.item}>
        <Bookmark size={24} />
        <span>북마크</span>
      </NavLink>
      <NavLink to="/today" className={({ isActive }) => isActive ? styles.activeItem : styles.item}>
        <Calendar size={24} />
        <span>오늘</span>
      </NavLink>
      <button className={styles.item} onClick={toggleTheme}>
        {theme === 'light' ? <Moon size={24} /> : <Sun size={24} />}
        <span>{theme === 'light' ? '다크' : '라이트'}</span>
      </button>
    </nav>
  );
};

export default BottomTabBar;
