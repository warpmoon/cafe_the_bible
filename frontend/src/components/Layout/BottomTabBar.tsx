import React from 'react';
import { NavLink } from 'react-router-dom';
import { BookOpen, Search, Bookmark, Calendar, Home } from 'lucide-react';
import styles from './BottomTabBar.module.css';

const BottomTabBar: React.FC = () => {
  return (
    <nav className={styles.nav}>
      <NavLink to="/" end className={({ isActive }) => isActive ? styles.activeItem : styles.item}>
        <Home size={24} />
        <span>홈</span>
      </NavLink>
      <NavLink to="/read" className={({ isActive }) => isActive ? styles.activeItem : styles.item}>
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
    </nav>
  );
};

export default BottomTabBar;
