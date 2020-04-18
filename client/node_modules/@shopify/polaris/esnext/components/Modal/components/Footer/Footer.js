import React from 'react';
import { buttonsFrom } from '../../../Button';
import { ButtonGroup } from '../../../ButtonGroup';
import { Stack } from '../../../Stack';
import styles from './Footer.scss';
export function Footer({ primaryAction, secondaryActions, children, }) {
    const primaryActionButton = (primaryAction && buttonsFrom(primaryAction, { primary: true })) || null;
    const secondaryActionButtons = (secondaryActions && buttonsFrom(secondaryActions)) || null;
    const actions = primaryActionButton || secondaryActionButtons ? (<ButtonGroup>
        {secondaryActionButtons}
        {primaryActionButton}
      </ButtonGroup>) : null;
    return (<div className={styles.Footer}>
      <div className={styles.FooterContent}>
        <Stack alignment="center">
          <Stack.Item fill>{children}</Stack.Item>
          {actions}
        </Stack>
      </div>
    </div>);
}
