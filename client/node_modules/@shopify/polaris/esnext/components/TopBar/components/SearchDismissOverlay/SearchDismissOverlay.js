import React, { useCallback, useRef } from 'react';
import { ScrollLock } from '../../../ScrollLock';
import { classNames } from '../../../../utilities/css';
import styles from './SearchDismissOverlay.scss';
export function SearchDismissOverlay({ onDismiss, visible }) {
    const node = useRef(null);
    const handleDismiss = useCallback(({ target }) => {
        if (target === node.current && onDismiss != null) {
            onDismiss();
        }
    }, [onDismiss]);
    return (<React.Fragment>
      {visible ? <ScrollLock /> : null}
      <div ref={node} className={classNames(styles.SearchDismissOverlay, visible && styles.visible)} onClick={handleDismiss}/>
    </React.Fragment>);
}
