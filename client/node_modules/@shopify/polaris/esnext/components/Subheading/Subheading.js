import React from 'react';
import styles from './Subheading.scss';
export function Subheading({ element: Element = 'h3', children, }) {
    const ariaLabel = typeof children === 'string' ? children : undefined;
    return (<Element aria-label={ariaLabel} className={styles.Subheading}>
      {children}
    </Element>);
}
