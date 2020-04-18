import React, { useRef, useState, useCallback } from 'react';
import { Button } from '../../../../../Button';
import { Popover } from '../../../../../Popover';
import { Select } from '../../../../../Select';
import { FormLayout } from '../../../../../FormLayout';
import { Form } from '../../../../../Form';
import { useToggle } from '../../../../../../utilities/use-toggle';
import { useI18n } from '../../../../../../utilities/i18n';
import { FilterValueSelector } from '../FilterValueSelector';
export function FilterCreator({ filters, resourceName, disabled, onAddFilter, }) {
    const { value: popoverActive, toggle: togglePopoverActive, setFalse: setPopoverActiveFalse, } = useToggle(false);
    const [selectedFilter, setSelectedFilter] = useState();
    const [selectedFilterKey, setSelectedFilterKey] = useState();
    const [selectedFilterValue, setSelectedFilterValue] = useState();
    const i18n = useI18n();
    const node = useRef(null);
    const canAddFilter = Boolean(selectedFilter && selectedFilterKey && selectedFilterValue);
    const handleButtonFocus = useCallback((...args) => {
        const event = args[0];
        if (!node.current && event) {
            node.current = event.target;
        }
    }, []);
    const handleFilterKeyChange = useCallback((filterKey) => {
        const foundFilter = filters.find((filter) => {
            const { minKey, maxKey, operatorText } = filter;
            if (minKey || maxKey) {
                return (filter.key === filterKey ||
                    minKey === filterKey ||
                    maxKey === filterKey);
            }
            if (operatorText && typeof operatorText !== 'string') {
                return (filter.key === filterKey ||
                    operatorText.filter(({ key }) => key === filterKey)
                        .length === 1);
            }
            return filter.key === filterKey;
        });
        if (!foundFilter) {
            return;
        }
        setSelectedFilter(foundFilter);
        setSelectedFilterKey(filterKey);
        setSelectedFilterValue(undefined);
    }, [filters]);
    const handleFilterValueChange = useCallback((value) => {
        setSelectedFilterValue(value);
    }, []);
    const handleAddFilter = useCallback(() => {
        if (!onAddFilter || !canAddFilter || !selectedFilterKey) {
            return;
        }
        onAddFilter({
            key: selectedFilterKey,
            value: selectedFilterValue || '',
        });
        setPopoverActiveFalse();
        setSelectedFilter(undefined);
        setSelectedFilterValue(undefined);
        if (node.current != null) {
            node.current.focus();
        }
    }, [
        canAddFilter,
        onAddFilter,
        selectedFilterKey,
        selectedFilterValue,
        setPopoverActiveFalse,
    ]);
    const activator = (<Button onClick={togglePopoverActive} disclosure testID="FilterCreator-FilterActivator" disabled={disabled} onFocus={handleButtonFocus}>
      {i18n.translate('Polaris.ResourceList.FilterCreator.filterButtonLabel')}
    </Button>);
    const filterOptions = filters.map(({ key, label }) => ({
        value: key,
        label,
    }));
    const filterValueSelectionMarkup = selectedFilter ? (<FilterValueSelector filter={selectedFilter} filterKey={selectedFilterKey} value={selectedFilterValue} onFilterKeyChange={handleFilterKeyChange} onChange={handleFilterValueChange}/>) : null;
    const addFilterButtonMarkup = selectedFilter ? (<Button onClick={handleAddFilter} disabled={!canAddFilter} testID="FilterCreator-AddFilterButton">
      {i18n.translate('Polaris.ResourceList.FilterCreator.addFilterButtonLabel')}
    </Button>) : null;
    return (<Popover active={popoverActive} activator={activator} onClose={togglePopoverActive} sectioned fullHeight>
      <Form onSubmit={handleAddFilter}>
        <FormLayout>
          <Select label={i18n.translate('Polaris.ResourceList.FilterCreator.showAllWhere', { resourceNamePlural: resourceName.plural.toLocaleLowerCase() })} placeholder={i18n.translate('Polaris.ResourceList.FilterCreator.selectFilterKeyPlaceholder')} options={filterOptions} onChange={handleFilterKeyChange} value={selectedFilter && selectedFilter.key}/>
          {filterValueSelectionMarkup}
          {addFilterButtonMarkup}
        </FormLayout>
      </Form>
    </Popover>);
}
