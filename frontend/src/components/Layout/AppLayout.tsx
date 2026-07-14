import React, { useEffect } from 'react';
import BottomTabBar from './BottomTabBar';
import Sidebar from './Sidebar';
import MobileHeader from './MobileHeader';
import { useReadingStore } from '../../store/readingStore';
import styles from './AppLayout.module.css';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { theme } = useReadingStore();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className={styles.layout}>
      <MobileHeader />
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
