import React from 'react';
import styles from '../../List.scss';
export function Item({ children }) {
    return <li className={styles.Item}>{children}</li>;
}
