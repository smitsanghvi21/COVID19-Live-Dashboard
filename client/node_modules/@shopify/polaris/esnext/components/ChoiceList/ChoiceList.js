import React from 'react';
import { classNames } from '../../utilities/css';
import { useUniqueId } from '../../utilities/unique-id';
import { Checkbox } from '../Checkbox';
import { RadioButton } from '../RadioButton';
import { InlineError, errorTextID } from '../InlineError';
import styles from './ChoiceList.scss';
export function ChoiceList({ title, titleHidden, allowMultiple, choices, selected, onChange = noop, error, disabled = false, name: nameProp, }) {
    // Type asserting to any is required for TS3.2 but can be removed when we update to 3.3
    // see https://github.com/Microsoft/TypeScript/issues/28768
    const ControlComponent = allowMultiple ? Checkbox : RadioButton;
    const name = useUniqueId('ChoiceList', nameProp);
    const finalName = allowMultiple ? `${name}[]` : name;
    const className = classNames(styles.ChoiceList, titleHidden && styles.titleHidden);
    const titleMarkup = title ? (<legend className={styles.Title}>{title}</legend>) : null;
    const choicesMarkup = choices.map((choice) => {
        const { value, label, helpText, disabled: choiceDisabled, describedByError, } = choice;
        function handleChange(checked) {
            onChange(updateSelectedChoices(choice, checked, selected, allowMultiple), name);
        }
        const isSelected = choiceIsSelected(choice, selected);
        const renderedChildren = choice.renderChildren
            ? choice.renderChildren(isSelected)
            : null;
        const children = renderedChildren ? (<div className={styles.ChoiceChildren}>{renderedChildren}</div>) : null;
        return (<li key={value}>
        <ControlComponent name={finalName} value={value} label={label} disabled={choiceDisabled || disabled} checked={choiceIsSelected(choice, selected)} helpText={helpText} onChange={handleChange} ariaDescribedBy={error && describedByError ? errorTextID(finalName) : null}/>
        {children}
      </li>);
    });
    const errorMarkup = error && (<div className={styles.ChoiceError}>
      <InlineError message={error} fieldID={finalName}/>
    </div>);
    return (<fieldset className={className} id={finalName} aria-invalid={error != null}>
      {titleMarkup}
      <ul className={styles.Choices}>{choicesMarkup}</ul>
      {errorMarkup}
    </fieldset>);
}
function noop() { }
function choiceIsSelected({ value }, selected) {
    return selected.includes(value);
}
function updateSelectedChoices({ value }, checked, selected, allowMultiple = false) {
    if (checked) {
        return allowMultiple ? [...selected, value] : [value];
    }
    return selected.filter((selectedChoice) => selectedChoice !== value);
}
