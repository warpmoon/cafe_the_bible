import React from "react";
import { NavLink } from "react-router-dom";
import { BookOpen, Search, Bookmark, Calendar, Sun, Moon } from "lucide-react";
import { useReadingStore } from "../../store/readingStore";
import styles from "./Sidebar.module.css";

const Sidebar: React.FC = () => {
  const { theme, toggleTheme } = useReadingStore();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>Cafe the Bible</div>
      <nav className={styles.nav}>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? styles.activeLink : styles.link
          }
        >
          <BookOpen size={20} />
          <span>성경 읽기</span>
        </NavLink>
        <NavLink
          to="/search"
          className={({ isActive }) =>
            isActive ? styles.activeLink : styles.link
          }
        >
          <Search size={20} />
          <span>검색</span>
        </NavLink>
        <NavLink
          to="/bookmarks"
          className={({ isActive }) =>
            isActive ? styles.activeLink : styles.link
          }
        >
          <Bookmark size={20} />
          <span>북마크</span>
        </NavLink>
        <NavLink
          to="/today"
          className={({ isActive }) =>
            isActive ? styles.activeLink : styles.link
          }
        >
          <Calendar size={20} />
          <span>오늘의 말씀</span>
        </NavLink>
      </nav>
      
      <div className={styles.footer}>
        <button className={styles.themeToggle} onClick={toggleTheme}>
          {theme === 'light' ? (
            <>
              <Moon size={20} />
              <span>다크 모드</span>
            </>
          ) : (
            <>
              <Sun size={20} />
              <span>라이트 모드</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
