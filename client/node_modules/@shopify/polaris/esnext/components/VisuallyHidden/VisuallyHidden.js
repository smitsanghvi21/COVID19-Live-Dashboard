import React from 'react';
import styles from './VisuallyHidden.scss';
export function VisuallyHidden({ children }) {
    return <span className={styles.VisuallyHidden}>{children}</span>;
}
