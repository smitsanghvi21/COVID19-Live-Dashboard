import { __rest } from "tslib";
import React from 'react';
import { ArrowUpDownMinor } from '@shopify/polaris-icons';
import { classNames } from '../../utilities/css';
import { useFeatures } from '../../utilities/features';
import { useUniqueId } from '../../utilities/unique-id';
import { Labelled, helpTextID } from '../Labelled';
import { Icon } from '../Icon';
import styles from './Select.scss';
const PLACEHOLDER_VALUE = '';
export function Select({ options: optionsProp, label, labelAction, labelHidden: labelHiddenProp, labelInline, disabled, helpText, placeholder, id: idProp, name, value = PLACEHOLDER_VALUE, error, onChange, onFocus, onBlur, }) {
    const id = useUniqueId('Select', idProp);
    const labelHidden = labelInline ? true : labelHiddenProp;
    const { newDesignLanguage } = useFeatures();
    const className = classNames(styles.Select, error && styles.error, disabled && styles.disabled, newDesignLanguage && styles.newDesignLanguage);
    const handleChange = onChange
        ? (event) => onChange(event.currentTarget.value, id)
        : undefined;
    const describedBy = [];
    if (helpText) {
        describedBy.push(helpTextID(id));
    }
    if (error) {
        describedBy.push(`${id}Error`);
    }
    const options = optionsProp || [];
    let normalizedOptions = options.map(normalizeOption);
    if (placeholder) {
        normalizedOptions = [
            {
                label: placeholder,
                value: PLACEHOLDER_VALUE,
                disabled: true,
            },
            ...normalizedOptions,
        ];
    }
    const inlineLabelMarkup = labelInline && (<span className={styles.InlineLabel}>{label}</span>);
    const selectedOption = getSelectedOption(normalizedOptions, value);
    const contentMarkup = (<div className={styles.Content} aria-hidden aria-disabled={disabled}>
      {inlineLabelMarkup}
      <span className={styles.SelectedOption}>{selectedOption}</span>
      <span className={styles.Icon}>
        <Icon source={ArrowUpDownMinor}/>
      </span>
    </div>);
    const optionsMarkup = normalizedOptions.map(renderOption);
    return (<Labelled id={id} label={label} error={error} action={labelAction} labelHidden={labelHidden} helpText={helpText}>
      <div className={className}>
        <select id={id} name={name} value={value} className={styles.Input} disabled={disabled} onFocus={onFocus} onBlur={onBlur} onChange={handleChange} aria-invalid={Boolean(error)} aria-describedby={describedBy.length ? describedBy.join(' ') : undefined}>
          {optionsMarkup}
        </select>
        {contentMarkup}
        <div className={styles.Backdrop}/>
      </div>
    </Labelled>);
}
function isString(option) {
    return typeof option === 'string';
}
function isGroup(option) {
    return (typeof option === 'object' && 'options' in option && option.options != null);
}
function normalizeStringOption(option) {
    return {
        label: option,
        value: option,
    };
}
/**
 * Converts a string option (and each string option in a Group) into
 * an Option object.
 */
function normalizeOption(option) {
    if (isString(option)) {
        return normalizeStringOption(option);
    }
    else if (isGroup(option)) {
        const { title, options } = option;
        return {
            title,
            options: options.map((option) => {
                return isString(option) ? normalizeStringOption(option) : option;
            }),
        };
    }
    return option;
}
/**
 * Gets the text to display in the UI, for the currently selected option
 */
function getSelectedOption(options, value) {
    const flatOptions = flattenOptions(options);
    let selectedOption = flatOptions.find((option) => value === option.value);
    if (selectedOption === undefined) {
        // Get the first visible option (not the hidden placeholder)
        selectedOption = flatOptions.find((option) => !option.hidden);
    }
    return selectedOption ? selectedOption.label : '';
}
/**
 * Ungroups an options array
 */
function flattenOptions(options) {
    let flatOptions = [];
    options.forEach((optionOrGroup) => {
        if (isGroup(optionOrGroup)) {
            flatOptions = flatOptions.concat(optionOrGroup.options);
        }
        else {
            flatOptions.push(optionOrGroup);
        }
    });
    return flatOptions;
}
function renderSingleOption(option) {
    const { value, label } = option, rest = __rest(option, ["value", "label"]);
    return (<option key={value} value={value} {...rest}>
      {label}
    </option>);
}
function renderOption(optionOrGroup) {
    if (isGroup(optionOrGroup)) {
        const { title, options } = optionOrGroup;
        return (<optgroup label={title} key={title}>
        {options.map(renderSingleOption)}
      </optgroup>);
    }
    return renderSingleOption(optionOrGroup);
}
