import React from 'react';
import { classNames, variationName } from '../../utilities/css';
import styles from './SkeletonThumbnail.scss';
export function SkeletonThumbnail({ size = 'medium' }) {
    const className = classNames(styles.SkeletonThumbnail, size && styles[variationName('size', size)]);
    return <div className={className}/>;
}
