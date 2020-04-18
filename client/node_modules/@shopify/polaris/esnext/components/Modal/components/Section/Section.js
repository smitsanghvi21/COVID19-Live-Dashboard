import React from 'react';
import { classNames } from '../../../../utilities/css';
import styles from './Section.scss';
export function Section({ children, flush = false, subdued = false, }) {
    const className = classNames(styles.Section, flush && styles.flush, subdued && styles.subdued);
    return <section className={className}>{children}</section>;
}
