import React from 'react';
import { classNames } from '../../../../utilities/css';
import styles from '../../Layout.scss';
export function Section({ children, secondary, fullWidth, oneHalf, oneThird, }) {
    const className = classNames(styles.Section, secondary && styles['Section-secondary'], fullWidth && styles['Section-fullWidth'], oneHalf && styles['Section-oneHalf'], oneThird && styles['Section-oneThird']);
    return <div className={className}>{children}</div>;
}
