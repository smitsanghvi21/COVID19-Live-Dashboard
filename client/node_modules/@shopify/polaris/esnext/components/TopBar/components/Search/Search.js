import React from 'react';
import { classNames } from '../../../../utilities/css';
import { SearchDismissOverlay } from '../SearchDismissOverlay';
import styles from './Search.scss';
export function Search({ visible, children, onDismiss, overlayVisible = false, }) {
    if (children == null) {
        return null;
    }
    const overlayMarkup = visible ? (<SearchDismissOverlay onDismiss={onDismiss} visible={overlayVisible}/>) : null;
    return (<div className={classNames(styles.Search, visible && styles.visible)}>
      {overlayMarkup}
      <div className={styles.Results}>{children}</div>
    </div>);
}
