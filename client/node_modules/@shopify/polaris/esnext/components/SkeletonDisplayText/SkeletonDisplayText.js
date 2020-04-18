import React from 'react';
import { classNames, variationName } from '../../utilities/css';
import styles from './SkeletonDisplayText.scss';
export function SkeletonDisplayText({ size = 'medium', }) {
    const className = classNames(styles.DisplayText, size && styles[variationName('size', size)]);
    return <div className={className}/>;
}
