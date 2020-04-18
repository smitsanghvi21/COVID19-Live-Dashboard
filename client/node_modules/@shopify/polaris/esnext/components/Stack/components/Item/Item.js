import React from 'react';
import { classNames } from '../../../../utilities/css';
import styles from '../../Stack.scss';
export function Item({ children, fill }) {
    const className = classNames(styles.Item, fill && styles['Item-fill']);
    return <div className={className}>{children}</div>;
}
