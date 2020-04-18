import React from 'react';
import { classNames, variationName } from '../../utilities/css';
import styles from './TextContainer.scss';
export function TextContainer({ spacing, children }) {
    const className = classNames(styles.TextContainer, spacing && styles[variationName('spacing', spacing)]);
    return <div className={className}>{children}</div>;
}
