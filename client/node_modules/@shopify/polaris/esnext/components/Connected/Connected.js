import React from 'react';
import { Item } from './components';
import styles from './Connected.scss';
export function Connected({ children, left, right }) {
    const leftConnectionMarkup = left ? (<Item position="left">{left}</Item>) : null;
    const rightConnectionMarkup = right ? (<Item position="right">{right}</Item>) : null;
    return (<div className={styles.Connected}>
      {leftConnectionMarkup}
      <Item position="primary">{children}</Item>
      {rightConnectionMarkup}
    </div>);
}
