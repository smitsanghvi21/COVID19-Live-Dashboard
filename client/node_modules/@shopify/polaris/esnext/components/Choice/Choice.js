import React from 'react';
import { classNames } from '../../utilities/css';
import { InlineError } from '../InlineError';
import styles from './Choice.scss';
export function Choice({ id, label, disabled, error, children, labelHidden, helpText, onClick, onMouseOut, onMouseOver, }) {
    const className = classNames(styles.Choice, labelHidden && styles.labelHidden, disabled && styles.disabled);
    const labelMarkup = (<label className={className} htmlFor={id} onClick={onClick} onMouseOver={onMouseOver} onMouseOut={onMouseOut}>
      <span className={styles.Control}>{children}</span>
      <span className={styles.Label}>{label}</span>
    </label>);
    const helpTextMarkup = helpText ? (<div className={styles.HelpText} id={helpTextID(id)}>
      {helpText}
    </div>) : null;
    const errorMarkup = error && typeof error !== 'boolean' && (<div className={styles.Error}>
      <InlineError message={error} fieldID={id}/>
    </div>);
    const descriptionMarkup = helpTextMarkup || errorMarkup ? (<div className={styles.Descriptions}>
        {errorMarkup}
        {helpTextMarkup}
      </div>) : null;
    return descriptionMarkup ? (<div>
      {labelMarkup}
      {descriptionMarkup}
    </div>) : (labelMarkup);
}
export function helpTextID(id) {
    return `${id}HelpText`;
}
