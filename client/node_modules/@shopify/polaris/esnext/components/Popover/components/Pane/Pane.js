import React from 'react';
import { classNames } from '../../../../utilities/css';
import { wrapWithComponent } from '../../../../utilities/components';
import { Scrollable } from '../../../Scrollable';
import { Section } from '../Section';
import styles from '../../Popover.scss';
export function Pane({ fixed, sectioned, children, onScrolledToBottom, }) {
    const className = classNames(styles.Pane, fixed && styles['Pane-fixed']);
    const content = sectioned
        ? wrapWithComponent(children, Section, {})
        : children;
    return fixed ? (<div className={className}>{content}</div>) : (<Scrollable hint shadow className={className} onScrolledToBottom={onScrolledToBottom}>
      {content}
    </Scrollable>);
}
