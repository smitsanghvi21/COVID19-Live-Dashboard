import React from 'react';
import { classNames } from '../../utilities/css';
import styles from './Indicator.scss';
export function Indicator({ pulse = true }) {
    const className = classNames(styles.Indicator, pulse && styles.pulseIndicator);
    return <span className={className}/>;
}
