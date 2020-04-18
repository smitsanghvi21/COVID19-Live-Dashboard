import React, { useState } from 'react';
import { TickSmallMinor } from '@shopify/polaris-icons';
import { classNames } from '../../../../utilities/css';
import { useFeatures } from '../../../../utilities/features';
import { useUniqueId } from '../../../../utilities/unique-id';
import { Icon } from '../../../Icon';
import styles from './Checkbox.scss';
export function Checkbox({ id: idProp, checked = false, disabled, active, onChange, name, value, role, }) {
    const id = useUniqueId('Checkbox', idProp);
    const { newDesignLanguage } = useFeatures();
    const [keyFocused, setKeyFocused] = useState(false);
    const className = classNames(styles.Checkbox, active && styles.active, newDesignLanguage && styles.newDesignLanguage);
    const handleBlur = () => {
        setKeyFocused(false);
    };
    const handleKeyUp = () => {
        !keyFocused && setKeyFocused(true);
    };
    const inputClassName = classNames(styles.Input, newDesignLanguage && keyFocused && styles.keyFocused);
    return (<div className={className}>
      <input id={id} name={name} value={value} type="checkbox" checked={checked} disabled={disabled} className={inputClassName} aria-checked={checked} onChange={onChange} onBlur={handleBlur} onKeyUp={handleKeyUp} role={role}/>
      <div className={styles.Backdrop}/>
      <div className={styles.Icon}>
        <Icon source={TickSmallMinor}/>
      </div>
    </div>);
}
