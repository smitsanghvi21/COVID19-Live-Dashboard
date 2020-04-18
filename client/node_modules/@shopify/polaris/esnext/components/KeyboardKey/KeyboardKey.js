import React from 'react';
import styles from './KeyboardKey.scss';
export function KeyboardKey({ children }) {
    let key = children || '';
    key = key.length > 1 ? key.toLowerCase() : key.toUpperCase();
    return <kbd className={styles.KeyboardKey}>{key}</kbd>;
}
