import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  BookOpen,
  Search,
  Bookmark,
  Calendar,
  Home,
  LibraryBig,
  MapPinned,
  UsersRound,
  CalendarDays,
  CalendarCheck,
  ClipboardCheck,
  NotebookPen,
  ListChecks,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import styles from "./Sidebar.module.css";

const Sidebar: React.FC = () => {
  const location = useLocation();
  const isReferenceActive = location.pathname.startsWith("/reference") || location.pathname === "/map";
  const isTodayActive = location.pathname.startsWith("/today");

  const [isReferenceOpen, setIsReferenceOpen] = useState(false);
  const [isTodayOpen, setIsTodayOpen] = useState(false);

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
        <NavLink
          to="/plan"
          className={({ isActive }) =>
            isActive ? styles.activeLink : styles.link
          }
        >
          <ListChecks size={20} />
          <span>읽기 계획</span>
        </NavLink>
        <div className={styles.navGroup}>
          <button
            type="button"
            className={`${isReferenceActive ? styles.activeLink : styles.link} ${styles.groupHeader}`}
            onClick={() => setIsReferenceOpen(!isReferenceOpen)}
          >
            <div className={styles.groupTitle}>
              <LibraryBig size={20} />
              <span>참고자료</span>
            </div>
            {isReferenceOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {isReferenceOpen && (
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
          )}
        </div>
        <div className={styles.navGroup}>
          <button
            type="button"
            className={`${isTodayActive ? styles.activeLink : styles.link} ${styles.groupHeader}`}
            onClick={() => setIsTodayOpen(!isTodayOpen)}
          >
            <div className={styles.groupTitle}>
              <Calendar size={20} />
              <span>오늘의 말씀</span>
            </div>
            {isTodayOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {isTodayOpen && (
            <div className={styles.subNav}>
              <NavLink
                to="/today/word"
                className={({ isActive }) =>
                  isActive ? styles.activeSubLink : styles.subLink
                }
              >
                <CalendarCheck size={16} />
                <span>오늘의 말씀</span>
              </NavLink>
              <NavLink
                to="/today/journal"
                className={({ isActive }) =>
                  isActive ? styles.activeSubLink : styles.subLink
                }
              >
                <NotebookPen size={16} />
                <span>예수 동행일기</span>
              </NavLink>
              <NavLink
                to="/today/check"
                className={({ isActive }) =>
                  isActive ? styles.activeSubLink : styles.subLink
                }
              >
                <ClipboardCheck size={16} />
                <span>오늘의 신앙 체크</span>
              </NavLink>
            </div>
          )}
        </div>
      </nav>
      
      <div className={styles.footer}>
        <ThemeSelector variant="sidebar" />
      </div>
    </aside>
  );
};

export default Sidebar;
