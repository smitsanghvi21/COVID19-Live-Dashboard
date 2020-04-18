import React, { useRef } from 'react';
import { Button } from '../../../../../Button';
import { useComponentDidMount } from '../../../../../../utilities/use-component-did-mount';
import styles from '../../BulkActions.scss';
export function BulkActionButton({ handleMeasurement, url, external, onAction, content, disclosure, accessibilityLabel, disabled, }) {
    const bulkActionButton = useRef(null);
    useComponentDidMount(() => {
        if (handleMeasurement && bulkActionButton.current) {
            const width = bulkActionButton.current.getBoundingClientRect().width;
            handleMeasurement(width);
        }
    });
    return (<div className={styles.BulkActionButton} ref={bulkActionButton}>
      <Button external={external} url={url} aria-label={accessibilityLabel} onClick={onAction} disabled={disabled} disclosure={disclosure}>
        {content}
      </Button>
    </div>);
}
