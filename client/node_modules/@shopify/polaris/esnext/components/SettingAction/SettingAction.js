import React from 'react';
import styles from './SettingAction.scss';
export function SettingAction({ action, children }) {
    return (<div className={styles.SettingAction}>
      <div className={styles.Setting}>{children}</div>
      <div className={styles.Action}>{action}</div>
    </div>);
}
