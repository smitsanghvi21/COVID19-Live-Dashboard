import React from 'react';
import { Stack } from '../Stack';
import { ButtonGroup } from '../ButtonGroup';
import { buttonsFrom } from '../Button';
import styles from './PageActions.scss';
export function PageActions({ primaryAction, secondaryActions, }) {
    const primaryActionMarkup = primaryAction
        ? buttonsFrom(primaryAction, { primary: true })
        : null;
    const secondaryActionsMarkup = secondaryActions ? (<ButtonGroup>{buttonsFrom(secondaryActions)}</ButtonGroup>) : null;
    const distribution = secondaryActionsMarkup ? 'equalSpacing' : 'trailing';
    return (<div className={styles.PageActions}>
      <Stack distribution={distribution} spacing="tight">
        {secondaryActionsMarkup}
        {primaryActionMarkup}
      </Stack>
    </div>);
}
