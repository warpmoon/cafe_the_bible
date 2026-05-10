import React from 'react';
import { NavLink } from 'react-router-dom';
import { CalendarCheck, ClipboardCheck, NotebookPen } from 'lucide-react';
import styles from './TodaySubNav.module.css';

const TodaySubNav: React.FC = () => (
  <nav className={styles.nav} aria-label="오늘의 말씀 하위 메뉴">
    <NavLink
      to="/today/word"
      className={({ isActive }) => (isActive ? styles.activeLink : styles.link)}
    >
      <CalendarCheck size={18} />
      <span>오늘의 말씀</span>
    </NavLink>
    <NavLink
      to="/today/journal"
      className={({ isActive }) => (isActive ? styles.activeLink : styles.link)}
    >
      <NotebookPen size={18} />
      <span>예수 동행일기</span>
    </NavLink>
    <NavLink
      to="/today/check"
      className={({ isActive }) => (isActive ? styles.activeLink : styles.link)}
    >
      <ClipboardCheck size={18} />
      <span>오늘의 신앙 체크</span>
    </NavLink>
  </nav>
);

export default TodaySubNav;
