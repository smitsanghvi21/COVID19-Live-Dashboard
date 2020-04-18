import React, { useCallback, useEffect, useState, useRef } from 'react';
import { CircleCancelMinor, SearchMinor } from '@shopify/polaris-icons';
import { classNames } from '../../../../utilities/css';
import { useI18n } from '../../../../utilities/i18n';
import { useFeatures } from '../../../../utilities/features';
import { useUniqueId } from '../../../../utilities/unique-id';
import { Icon } from '../../../Icon';
import { VisuallyHidden } from '../../../VisuallyHidden';
import styles from './SearchField.scss';
export function SearchField({ value, focused, active, placeholder, onChange, onFocus, onBlur, onCancel, showFocusBorder, }) {
    const i18n = useI18n();
    const [forceActive, setForceActive] = useState(false);
    const { newDesignLanguage } = useFeatures();
    const input = useRef(null);
    const searchId = useUniqueId('SearchField');
    const handleChange = useCallback(({ currentTarget }) => {
        onChange(currentTarget.value);
    }, [onChange]);
    const handleFocus = useCallback(() => onFocus && onFocus(), [onFocus]);
    const handleBlur = useCallback(() => onBlur && onBlur(), [onBlur]);
    const handleClear = useCallback(() => {
        onCancel && onCancel();
        if (!input.current) {
            return;
        }
        input.current.value = '';
        onChange('');
        input.current.focus();
    }, [onCancel, onChange]);
    useEffect(() => {
        if (!input.current) {
            return;
        }
        if (focused) {
            input.current.focus();
        }
        else {
            input.current.blur();
        }
    }, [focused]);
    const clearMarkup = value !== '' && (<button type="button" aria-label={i18n.translate('Polaris.TopBar.SearchField.clearButtonLabel')} className={styles.Clear} onClick={handleClear} onBlur={() => {
        setForceActive(false);
        handleClear();
    }} onFocus={() => {
        handleFocus();
        setForceActive(true);
    }}>
      <Icon source={CircleCancelMinor}/>
    </button>);
    const className = classNames(styles.SearchField, (focused || active || forceActive) && styles.focused, newDesignLanguage && styles['SearchField-newDesignLanguage']);
    return (<div className={className} onFocus={handleFocus} onBlur={handleBlur}>
      <VisuallyHidden>
        <label htmlFor={searchId}>
          {i18n.translate('Polaris.TopBar.SearchField.search')}
        </label>
      </VisuallyHidden>
      <input id={searchId} className={styles.Input} placeholder={placeholder} type="search" autoCapitalize="off" autoComplete="off" autoCorrect="off" ref={input} value={value} onChange={handleChange} onKeyDown={preventDefault}/>
      <span className={styles.Icon}>
        <Icon source={SearchMinor}/>
      </span>

      {clearMarkup}
      <div className={classNames(styles.Backdrop, showFocusBorder && styles.BackdropShowFocusBorder)}/>
    </div>);
}
function preventDefault(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
    }
}
