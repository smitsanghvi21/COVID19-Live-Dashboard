import React from 'react';
import { buttonsFrom } from '../../../Button';
import { ButtonGroup } from '../../../ButtonGroup';
import { Stack } from '../../../Stack';
import { Heading } from '../../../Heading';
import styles from '../../Card.scss';
export function Header({ children, title, actions }) {
    const actionMarkup = actions ? (<ButtonGroup>{buttonsFrom(actions, { plain: true })}</ButtonGroup>) : null;
    const titleMarkup = React.isValidElement(title) ? (title) : (<Heading>{title}</Heading>);
    const headingMarkup = actionMarkup || children ? (<Stack alignment="baseline">
        <Stack.Item fill>{titleMarkup}</Stack.Item>
        {actionMarkup}
        {children}
      </Stack>) : (titleMarkup);
    return <div className={styles.Header}>{headingMarkup}</div>;
}
