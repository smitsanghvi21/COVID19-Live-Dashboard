import React from 'react';
import { classNames } from '../../utilities/css';
import { ScrollLock } from '../ScrollLock';
import styles from './Backdrop.scss';
export function Backdrop(props) {
    const { onClick, onTouchStart, belowNavigation, transparent } = props;
    const className = classNames(styles.Backdrop, belowNavigation && styles.belowNavigation, transparent && styles.transparent);
    return (<React.Fragment>
      <ScrollLock />
      <div className={className} onClick={onClick} testID="Backdrop" onTouchStart={onTouchStart}/>
    </React.Fragment>);
}
