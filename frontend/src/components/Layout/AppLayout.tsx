import React from 'react';
import BottomTabBar from './BottomTabBar';
import Sidebar from './Sidebar';
import styles from './AppLayout.module.css';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.main}>
        <div className={styles.content}>
          {children}
        </div>
      </main>
      <BottomTabBar />
    </div>
  );
};

export default AppLayout;
