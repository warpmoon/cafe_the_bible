import React from 'react';
import styles from './Skeleton.module.css';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
  variant?: 'text' | 'rect' | 'circle';
}

const Skeleton: React.FC<SkeletonProps> = ({
  width,
  height,
  borderRadius,
  className = '',
  variant = 'rect'
}) => {
  const style: React.CSSProperties = {
    width,
    height,
    borderRadius: borderRadius || (variant === 'circle' ? '50%' : 'var(--radius-sm)'),
  };

  return (
    <div 
      className={`${styles.skeleton} ${styles[variant]} ${className}`} 
      style={style}
    />
  );
};

export default Skeleton;
