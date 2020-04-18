import React from 'react';
import { classNames } from '../../../../utilities/css';
import styles from '../../Tabs.scss';
export function Panel({ hidden, id, tabID, children }) {
    const className = classNames(styles.Panel, hidden && styles['Panel-hidden']);
    return (<div className={className} id={id} role="tabpanel" aria-labelledby={tabID} tabIndex={-1}>
      {children}
    </div>);
}
