import React, { useCallback } from 'react';
import { Select } from '../../../../../Select';
import { Stack } from '../../../../../Stack';
import { TextField } from '../../../../../TextField';
import { DateSelector } from '../DateSelector';
import { FilterType } from '../../types';
import { useI18n } from '../../../../../../utilities/i18n';
import { useIsMountedRef } from '../../../../../../utilities/use-is-mounted-ref';
export function FilterValueSelector({ filter, filterKey, value, onChange, onFilterKeyChange, }) {
    const i18n = useI18n();
    const isMounted = useIsMountedRef();
    const { operatorText, type, label } = filter;
    const showOperatorOptions = type !== FilterType.DateSelector &&
        operatorText &&
        typeof operatorText !== 'string';
    const handleOperatorOptionChange = useCallback((operatorKey) => {
        onFilterKeyChange(operatorKey);
        if (!value) {
            return;
        }
        onChange(value);
    }, [onChange, onFilterKeyChange, value]);
    if (showOperatorOptions && operatorText.length !== 0 && !isMounted.current) {
        handleOperatorOptionChange(operatorText[0].key);
    }
    const operatorOptionsMarkup = showOperatorOptions ? (<Select label={label} labelHidden options={buildOperatorOptions(operatorText)} value={filterKey} onChange={handleOperatorOptionChange}/>) : null;
    const selectedFilterLabel = typeof operatorText === 'string' ? operatorText : '';
    switch (filter.type) {
        case FilterType.Select:
            return (<Stack vertical>
          {operatorOptionsMarkup}
          <Select label={selectedFilterLabel} options={filter.options} placeholder={i18n.translate('Polaris.ResourceList.FilterValueSelector.selectFilterValuePlaceholder')} value={value} onChange={onChange}/>
        </Stack>);
        case FilterType.TextField:
            return (<Stack vertical>
          {operatorOptionsMarkup}
          <TextField label={selectedFilterLabel} value={value} type={filter.textFieldType} onChange={onChange}/>
        </Stack>);
        case FilterType.DateSelector:
            return (<DateSelector dateOptionType={filter.dateOptionType} filterValue={value} filterKey={filterKey} filterMinKey={filter.minKey} filterMaxKey={filter.maxKey} onFilterValueChange={onChange} onFilterKeyChange={onFilterKeyChange}/>);
        default:
            return null;
    }
}
function buildOperatorOptions(operatorText) {
    if (!operatorText || typeof operatorText === 'string') {
        return [];
    }
    return operatorText.map(({ key, optionLabel }) => {
        return { value: key, label: optionLabel };
    });
}
