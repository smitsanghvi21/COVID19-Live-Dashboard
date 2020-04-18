import React from 'react';
import { AlertMinor } from '@shopify/polaris-icons';
import { Icon } from '../Icon';
import styles from './InlineError.scss';
export function InlineError({ message, fieldID }) {
    if (!message) {
        return null;
    }
    return (<div id={errorTextID(fieldID)} className={styles.InlineError}>
      <div className={styles.Icon}>
        <Icon source={AlertMinor}/>
      </div>
      {message}
    </div>);
}
export function errorTextID(id) {
    return `${id}Error`;
}
