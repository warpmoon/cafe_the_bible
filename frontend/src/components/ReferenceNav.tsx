import React from "react";
import { NavLink } from "react-router-dom";
import { CalendarDays, MapPinned, UsersRound } from "lucide-react";
import styles from "./ReferenceNav.module.css";

const ReferenceNav: React.FC = () => {
  return (
    <nav className={styles.nav} aria-label="참고자료 메뉴">
      <NavLink
        to="/reference/map"
        className={({ isActive }) => (isActive ? styles.activeLink : styles.link)}
      >
        <MapPinned size={18} />
        <span>지도맵</span>
      </NavLink>
      <NavLink
        to="/reference/people"
        className={({ isActive }) => (isActive ? styles.activeLink : styles.link)}
      >
        <UsersRound size={18} />
        <span>인물 정보</span>
      </NavLink>
      <NavLink
        to="/reference/festivals"
        className={({ isActive }) => (isActive ? styles.activeLink : styles.link)}
      >
        <CalendarDays size={18} />
        <span>절기 정보</span>
      </NavLink>
    </nav>
  );
};

export default ReferenceNav;
