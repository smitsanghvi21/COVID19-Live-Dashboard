import React from 'react';
import styles from './Truncate.scss';
export function Truncate({ children }) {
    return <span className={styles.Truncate}>{children}</span>;
}
