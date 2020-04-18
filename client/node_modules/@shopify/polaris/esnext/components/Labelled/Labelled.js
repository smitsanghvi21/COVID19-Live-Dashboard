import { __rest } from "tslib";
import React from 'react';
import { classNames } from '../../utilities/css';
import { buttonFrom } from '../Button';
import { Label, labelID } from '../Label';
import { InlineError } from '../InlineError';
import styles from './Labelled.scss';
export { labelID };
export function Labelled(_a) {
    var { id, label, error, action, helpText, children, labelHidden } = _a, rest = __rest(_a, ["id", "label", "error", "action", "helpText", "children", "labelHidden"]);
    const className = classNames(labelHidden && styles.hidden);
    const actionMarkup = action ? (<div className={styles.Action}>{buttonFrom(action, { plain: true })}</div>) : null;
    const helpTextMarkup = helpText ? (<div className={styles.HelpText} id={helpTextID(id)}>
      {helpText}
    </div>) : null;
    const errorMarkup = error && typeof error !== 'boolean' && (<div className={styles.Error}>
      <InlineError message={error} fieldID={id}/>
    </div>);
    const labelMarkup = label ? (<div className={styles.LabelWrapper}>
      <Label id={id} {...rest} hidden={false}>
        {label}
      </Label>

      {actionMarkup}
    </div>) : null;
    return (<div className={className}>
      {labelMarkup}
      {children}
      {errorMarkup}
      {helpTextMarkup}
    </div>);
}
export function errorID(id) {
    return `${id}Error`;
}
export function helpTextID(id) {
    return `${id}HelpText`;
}
