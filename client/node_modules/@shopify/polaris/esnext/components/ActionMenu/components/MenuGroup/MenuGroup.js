import React, { useCallback } from 'react';
import { useFeatures } from '../../../../utilities/features';
import { ActionList } from '../../../ActionList';
import { Popover } from '../../../Popover';
import { MenuAction } from '../MenuAction';
import { Button } from '../../../Button';
import styles from './MenuGroup.scss';
export function MenuGroup({ accessibilityLabel, active, actions, details, title, icon, onClose, onOpen, }) {
    const { newDesignLanguage } = useFeatures();
    const handleClose = useCallback(() => {
        onClose(title);
    }, [onClose, title]);
    const handleOpen = useCallback(() => {
        onOpen(title);
    }, [onOpen, title]);
    if (!actions.length) {
        return null;
    }
    const popoverActivator = newDesignLanguage ? (<Button disclosure icon={icon} accessibilityLabel={accessibilityLabel} onClick={handleOpen}>
      {title}
    </Button>) : (<MenuAction disclosure content={title} icon={icon} accessibilityLabel={accessibilityLabel} onAction={handleOpen}/>);
    return (<Popover active={Boolean(active)} activator={popoverActivator} preferredAlignment="left" onClose={handleClose}>
      <ActionList items={actions} onActionAnyItem={handleClose}/>
      {details && <div className={styles.Details}>{details}</div>}
    </Popover>);
}
