import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  BookOpen,
  Search,
  Bookmark,
  Calendar,
  Sun,
  Moon,
  Home,
  LibraryBig,
  MapPinned,
  UsersRound,
  CalendarDays,
} from "lucide-react";
import { useReadingStore } from "../../store/readingStore";
import styles from "./Sidebar.module.css";

const Sidebar: React.FC = () => {
  const { theme, toggleTheme } = useReadingStore();
  const location = useLocation();
  const isReferenceActive = location.pathname.startsWith("/reference") || location.pathname === "/map";

  return (
    <aside className={styles.sidebar}>
      <NavLink to="/" className={styles.logo}>Cafe the Bible</NavLink>
      <nav className={styles.nav}>
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive ? styles.activeLink : styles.link
          }
        >
          <Home size={20} />
          <span>홈</span>
        </NavLink>
        <NavLink
          to="/read"
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
        <div className={styles.navGroup}>
          <NavLink
            to="/reference/map"
            className={isReferenceActive ? styles.activeLink : styles.link}
          >
            <LibraryBig size={20} />
            <span>참고자료</span>
          </NavLink>
          <div className={styles.subNav}>
            <NavLink
              to="/reference/map"
              className={({ isActive }) =>
                isActive ? styles.activeSubLink : styles.subLink
              }
            >
              <MapPinned size={16} />
              <span>지도맵</span>
            </NavLink>
            <NavLink
              to="/reference/people"
              className={({ isActive }) =>
                isActive ? styles.activeSubLink : styles.subLink
              }
            >
              <UsersRound size={16} />
              <span>인물 정보</span>
            </NavLink>
            <NavLink
              to="/reference/festivals"
              className={({ isActive }) =>
                isActive ? styles.activeSubLink : styles.subLink
              }
            >
              <CalendarDays size={16} />
              <span>절기 정보</span>
            </NavLink>
          </div>
        </div>
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
