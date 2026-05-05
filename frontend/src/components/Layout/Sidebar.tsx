import React from "react";
import { NavLink } from "react-router-dom";
import { BookOpen, Search, Bookmark, Calendar } from "lucide-react";
import styles from "./Sidebar.module.css";

const Sidebar: React.FC = () => {
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
    </aside>
  );
};

export default Sidebar;
