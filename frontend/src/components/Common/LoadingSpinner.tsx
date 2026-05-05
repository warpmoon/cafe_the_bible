import React from 'react';
import styles from './LoadingSpinner.module.css';

const LoadingSpinner: React.FC = () => (
  <div className={styles.container}>
    <div className={styles.spinner} />
  </div>
);

export default LoadingSpinner;
