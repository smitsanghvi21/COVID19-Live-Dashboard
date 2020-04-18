import React from 'react';
import styles from './Heading.scss';
export function Heading({ element: Element = 'h2', children }) {
    return <Element className={styles.Heading}>{children}</Element>;
}
