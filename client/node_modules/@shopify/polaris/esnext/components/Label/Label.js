import React from 'react';
import { classNames } from '../../utilities/css';
import styles from './Label.scss';
export function labelID(id) {
    return `${id}Label`;
}
export function Label({ children, id, hidden }) {
    const className = classNames(styles.Label, hidden && styles.hidden);
    return (<div className={className}>
      <label id={labelID(id)} htmlFor={id} className={styles.Text}>
        {children}
      </label>
    </div>);
}
