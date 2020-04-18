import React, { useState, useEffect, useRef, useCallback } from 'react';
import { addEventListener } from '@shopify/javascript-utilities/events';
import { CircleCancelMinor } from '@shopify/polaris-icons';
import { VisuallyHidden } from '../VisuallyHidden';
import { classNames, variationName } from '../../utilities/css';
import { useFeatures } from '../../utilities/features';
import { useI18n } from '../../utilities/i18n';
import { useUniqueId } from '../../utilities/unique-id';
import { useIsAfterInitialMount } from '../../utilities/use-is-after-initial-mount';
import { Labelled, helpTextID, labelID } from '../Labelled';
import { Connected } from '../Connected';
import { Key } from '../../types';
import { Icon } from '../Icon';
import { Resizer, Spinner } from './components';
import styles from './TextField.scss';
export function TextField({ prefix, suffix, placeholder, value, helpText, label, labelAction, labelHidden, disabled, clearButton, readOnly, autoFocus, focused, multiline, error, connectedRight, connectedLeft, type, name, id: idProp, role, step, autoComplete, max, maxLength, min, minLength, pattern, spellCheck, ariaOwns, ariaControls, ariaActiveDescendant, ariaAutocomplete, showCharacterCount, align, onClearButtonClick, onChange, onFocus, onBlur, }) {
    const i18n = useI18n();
    const [height, setHeight] = useState(null);
    const [focus, setFocus] = useState(Boolean(focused));
    const isAfterInitial = useIsAfterInitialMount();
    const id = useUniqueId('TextField', idProp);
    const inputRef = useRef(null);
    const prefixRef = useRef(null);
    const suffixRef = useRef(null);
    const buttonPressTimer = useRef();
    useEffect(() => {
        const input = inputRef.current;
        if (!input || focused === undefined)
            return;
        focused ? input.focus() : input.blur();
    }, [focused]);
    const { newDesignLanguage } = useFeatures();
    // Use a typeof check here as Typescript mostly protects us from non-stringy
    // values but overzealous usage of `any` in consuming apps means people have
    // been known to pass a number in, so make it clear that doesn't work.
    const normalizedValue = typeof value === 'string' ? value : '';
    const normalizedStep = step != null ? step : 1;
    const normalizedMax = max != null ? max : Infinity;
    const normalizedMin = min != null ? min : -Infinity;
    const className = classNames(styles.TextField, Boolean(normalizedValue) && styles.hasValue, disabled && styles.disabled, readOnly && styles.readOnly, error && styles.error, multiline && styles.multiline, focus && styles.focus, newDesignLanguage && styles.newDesignLanguage);
    const inputType = type === 'currency' ? 'text' : type;
    const prefixMarkup = prefix ? (<div className={styles.Prefix} id={`${id}Prefix`} ref={prefixRef}>
      {prefix}
    </div>) : null;
    const suffixMarkup = suffix ? (<div className={styles.Suffix} id={`${id}Suffix`} ref={suffixRef}>
      {suffix}
    </div>) : null;
    let characterCountMarkup = null;
    if (showCharacterCount) {
        const characterCount = normalizedValue.length;
        const characterCountLabel = maxLength
            ? i18n.translate('Polaris.TextField.characterCountWithMaxLength', {
                count: characterCount,
                limit: maxLength,
            })
            : i18n.translate('Polaris.TextField.characterCount', {
                count: characterCount,
            });
        const characterCountClassName = classNames(styles.CharacterCount, multiline && styles.AlignFieldBottom);
        const characterCountText = !maxLength
            ? characterCount
            : `${characterCount}/${maxLength}`;
        characterCountMarkup = (<div id={`${id}CharacterCounter`} className={characterCountClassName} aria-label={characterCountLabel} aria-live={focus ? 'polite' : 'off'} aria-atomic="true">
        {characterCountText}
      </div>);
    }
    const clearButtonMarkup = clearButton && normalizedValue !== '' ? (<button type="button" testID="clearButton" className={styles.ClearButton} onClick={handleClearButtonPress} disabled={disabled}>
        <VisuallyHidden>
          {i18n.translate('Polaris.Common.clear')}
        </VisuallyHidden>
        <Icon source={CircleCancelMinor} color="inkLightest"/>
      </button>) : null;
    const handleNumberChange = useCallback((steps) => {
        if (onChange == null) {
            return;
        }
        // Returns the length of decimal places in a number
        const dpl = (num) => (num.toString().split('.')[1] || []).length;
        const numericValue = value ? parseFloat(value) : 0;
        if (isNaN(numericValue)) {
            return;
        }
        // Making sure the new value has the same length of decimal places as the
        // step / value has.
        const decimalPlaces = Math.max(dpl(numericValue), dpl(normalizedStep));
        const newValue = Math.min(Number(normalizedMax), Math.max(numericValue + steps * normalizedStep, Number(normalizedMin)));
        onChange(String(newValue.toFixed(decimalPlaces)), id);
    }, [id, normalizedMax, normalizedMin, onChange, normalizedStep, value]);
    const handleButtonRelease = useCallback(() => {
        clearTimeout(buttonPressTimer.current);
    }, []);
    const handleButtonPress = useCallback((onChange) => {
        const minInterval = 50;
        const decrementBy = 10;
        let interval = 200;
        const onChangeInterval = () => {
            if (interval > minInterval)
                interval -= decrementBy;
            onChange();
            buttonPressTimer.current = window.setTimeout(onChangeInterval, interval);
        };
        buttonPressTimer.current = window.setTimeout(onChangeInterval, interval);
        addEventListener(document, 'mouseup', handleButtonRelease, {
            once: true,
        });
    }, [handleButtonRelease]);
    const spinnerMarkup = type === 'number' && !disabled && !readOnly ? (<Spinner onChange={handleNumberChange} onMouseDown={handleButtonPress} onMouseUp={handleButtonRelease}/>) : null;
    const style = multiline && height ? { height } : null;
    const handleExpandingResize = useCallback((height) => {
        setHeight(height);
    }, []);
    const resizer = multiline && isAfterInitial ? (<Resizer contents={normalizedValue || placeholder} currentHeight={height} minimumLines={typeof multiline === 'number' ? multiline : 1} onHeightChange={handleExpandingResize}/>) : null;
    const describedBy = [];
    if (error) {
        describedBy.push(`${id}Error`);
    }
    if (helpText) {
        describedBy.push(helpTextID(id));
    }
    if (showCharacterCount) {
        describedBy.push(`${id}CharacterCounter`);
    }
    const labelledBy = [];
    if (prefix) {
        labelledBy.push(`${id}Prefix`);
    }
    if (suffix) {
        labelledBy.push(`${id}Suffix`);
    }
    labelledBy.unshift(labelID(id));
    const inputClassName = classNames(styles.Input, align && styles[variationName('Input-align', align)], suffix && styles['Input-suffixed'], clearButton && styles['Input-hasClearButton']);
    const input = React.createElement(multiline ? 'textarea' : 'input', {
        name,
        id,
        disabled,
        readOnly,
        role,
        autoFocus,
        value: normalizedValue,
        placeholder,
        onFocus,
        onBlur,
        onKeyPress: handleKeyPress,
        style,
        autoComplete: normalizeAutoComplete(autoComplete),
        className: inputClassName,
        onChange: handleChange,
        ref: inputRef,
        min,
        max,
        step,
        minLength,
        maxLength,
        spellCheck,
        pattern,
        type: inputType,
        'aria-describedby': describedBy.length ? describedBy.join(' ') : undefined,
        'aria-labelledby': labelledBy.join(' '),
        'aria-invalid': Boolean(error),
        'aria-owns': ariaOwns,
        'aria-activedescendant': ariaActiveDescendant,
        'aria-autocomplete': ariaAutocomplete,
        'aria-controls': ariaControls,
        'aria-multiline': normalizeAriaMultiline(multiline),
    });
    const backdropClassName = classNames(styles.Backdrop, newDesignLanguage && connectedLeft && styles['Backdrop-connectedLeft'], newDesignLanguage && connectedRight && styles['Backdrop-connectedRight']);
    return (<Labelled label={label} id={id} error={error} action={labelAction} labelHidden={labelHidden} helpText={helpText}>
      <Connected left={connectedLeft} right={connectedRight}>
        <div className={className} onFocus={handleFocus} onBlur={handleBlur} onClick={handleClick}>
          {prefixMarkup}
          {input}
          {suffixMarkup}
          {characterCountMarkup}
          {clearButtonMarkup}
          {spinnerMarkup}
          <div className={backdropClassName}/>
          {resizer}
        </div>
      </Connected>
    </Labelled>);
    function handleClearButtonPress() {
        onClearButtonClick && onClearButtonClick(id);
    }
    function handleKeyPress(event) {
        const { key, which } = event;
        const numbersSpec = /[\d.eE+-]$/;
        if (type !== 'number' || which === Key.Enter || numbersSpec.test(key)) {
            return;
        }
        event.preventDefault();
    }
    function containsAffix(target) {
        return (target instanceof HTMLElement &&
            ((prefixRef.current && prefixRef.current.contains(target)) ||
                (suffixRef.current && suffixRef.current.contains(target))));
    }
    function handleChange(event) {
        onChange && onChange(event.currentTarget.value, id);
    }
    function handleFocus({ target }) {
        if (containsAffix(target)) {
            return;
        }
        setFocus(true);
    }
    function handleBlur() {
        setFocus(false);
    }
    function handleClick({ target }) {
        if (containsAffix(target)) {
            return;
        }
        inputRef.current && inputRef.current.focus();
    }
}
function normalizeAutoComplete(autoComplete) {
    if (autoComplete === true) {
        return 'on';
    }
    else if (autoComplete === false) {
        return 'off';
    }
    else {
        return autoComplete;
    }
}
function normalizeAriaMultiline(multiline) {
    switch (typeof multiline) {
        case 'undefined':
            return false;
        case 'boolean':
            return multiline;
        case 'number':
            return Boolean(multiline > 0);
    }
}
