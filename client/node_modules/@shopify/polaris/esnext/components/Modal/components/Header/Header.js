import React from 'react';
import { DisplayText } from '../../../DisplayText';
import { CloseButton } from '../CloseButton';
import styles from './Header.scss';
export function Header({ id, children, onClose }) {
    return (<div className={styles.Header}>
      <div id={id} className={styles.Title}>
        <DisplayText element="h2" size="small">
          {children}
        </DisplayText>
      </div>

      <CloseButton onClick={onClose}/>
    </div>);
}
