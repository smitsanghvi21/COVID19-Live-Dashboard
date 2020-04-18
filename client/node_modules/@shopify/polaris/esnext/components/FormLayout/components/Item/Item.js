import React from 'react';
import styles from '../../FormLayout.scss';
export function Item(props) {
    return <div className={styles.Item}>{props.children}</div>;
}
