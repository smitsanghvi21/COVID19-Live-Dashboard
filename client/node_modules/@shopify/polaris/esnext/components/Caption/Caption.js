import React from 'react';
import styles from './Caption.scss';
export function Caption({ children }) {
    return <p className={styles.Caption}>{children}</p>;
}
