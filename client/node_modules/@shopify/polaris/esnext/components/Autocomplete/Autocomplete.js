import React from 'react';
import { useI18n } from '../../utilities/i18n';
import { Spinner } from '../Spinner';
import { TextField, ComboBox } from './components';
import styles from './Autocomplete.scss';
// TypeScript can't generate types that correctly infer the typing of
// subcomponents so explicitly state the subcomponents in the type definition.
// Letting this be implicit works in this project but fails in projects that use
// generated *.d.ts files.
export const Autocomplete = function Autocomplete({ id, options, selected, textField, preferredPosition, listTitle, allowMultiple, loading, actionBefore, willLoadMoreResults, emptyState, onSelect, onLoadMoreResults, }) {
    const i18n = useI18n();
    const spinnerMarkup = loading ? (<div className={styles.Loading}>
      <Spinner size="small" accessibilityLabel={i18n.translate('Polaris.Autocomplete.spinnerAccessibilityLabel')}/>
    </div>) : null;
    const conditionalOptions = loading && !willLoadMoreResults ? [] : options;
    const conditionalAction = actionBefore && actionBefore !== [] ? [actionBefore] : undefined;
    return (<ComboBox id={id} options={conditionalOptions} selected={selected} textField={textField} preferredPosition={preferredPosition} listTitle={listTitle} allowMultiple={allowMultiple} contentAfter={spinnerMarkup} actionsBefore={conditionalAction} onSelect={onSelect} onEndReached={onLoadMoreResults} emptyState={emptyState}/>);
};
Autocomplete.ComboBox = ComboBox;
Autocomplete.TextField = TextField;
