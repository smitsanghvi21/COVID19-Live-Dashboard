import React from 'react';
import styles from './MessageIndicator.scss';
export function MessageIndicator({ children, active }) {
    const indicatorMarkup = active && (<div testID="indicator" className={styles.MessageIndicator}/>);
    return (<div className={styles.MessageIndicatorWrapper}>
      {indicatorMarkup}
      {children}
    </div>);
}
