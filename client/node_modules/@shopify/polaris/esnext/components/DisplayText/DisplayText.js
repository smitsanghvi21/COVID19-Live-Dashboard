import React from 'react';
import { classNames, variationName } from '../../utilities/css';
import styles from './DisplayText.scss';
export function DisplayText({ element: Element = 'p', children, size = 'medium', }) {
    const className = classNames(styles.DisplayText, size && styles[variationName('size', size)]);
    return <Element className={className}>{children}</Element>;
}
