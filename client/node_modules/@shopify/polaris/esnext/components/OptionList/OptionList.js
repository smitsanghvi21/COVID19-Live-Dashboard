import React, { useState, useCallback } from 'react';
import { arraysAreEqual } from '../../utilities/arrays';
import { useFeatures } from '../../utilities/features';
import { classNames } from '../../utilities/css';
import { useUniqueId } from '../../utilities/unique-id';
import { useDeepEffect } from '../../utilities/use-deep-effect';
import { Option } from './components';
import styles from './OptionList.scss';
export function OptionList({ options, sections, title, selected, allowMultiple, role, optionRole, onChange, id: idProp, }) {
    const [normalizedOptions, setNormalizedOptions] = useState(createNormalizedOptions(options, sections, title));
    const id = useUniqueId('OptionList', idProp);
    const { newDesignLanguage } = useFeatures();
    useDeepEffect(() => {
        setNormalizedOptions(createNormalizedOptions(options || [], sections || [], title));
    }, [options, sections, title], optionArraysAreEqual);
    const handleClick = useCallback((sectionIndex, optionIndex) => {
        const selectedValue = normalizedOptions[sectionIndex].options[optionIndex].value;
        const foundIndex = selected.indexOf(selectedValue);
        if (allowMultiple) {
            const newSelection = foundIndex === -1
                ? [selectedValue, ...selected]
                : [
                    ...selected.slice(0, foundIndex),
                    ...selected.slice(foundIndex + 1, selected.length),
                ];
            onChange(newSelection);
            return;
        }
        onChange([selectedValue]);
    }, [normalizedOptions, selected, allowMultiple, onChange]);
    const optionsExist = normalizedOptions.length > 0;
    const optionsMarkup = optionsExist
        ? normalizedOptions.map(({ title, options }, sectionIndex) => {
            const titleMarkup = title ? (<p className={styles.Title} role={role}>
            {title}
          </p>) : null;
            const optionsMarkup = options &&
                options.map((option, optionIndex) => {
                    const isSelected = selected.includes(option.value);
                    const optionId = option.id || `${id}-${sectionIndex}-${optionIndex}`;
                    return (<Option {...option} key={optionId} id={optionId} section={sectionIndex} index={optionIndex} onClick={handleClick} select={isSelected} allowMultiple={allowMultiple} role={optionRole}/>);
                });
            return (<li key={title || `noTitle-${sectionIndex}`}>
            {titleMarkup}
            <ul className={styles.Options} id={`${id}-${sectionIndex}`} role={role} aria-multiselectable={allowMultiple}>
              {optionsMarkup}
            </ul>
          </li>);
        })
        : null;
    const optionListClassName = classNames(styles.OptionList, newDesignLanguage && styles.newDesignLanguage);
    return (<ul className={optionListClassName} role={role}>
      {optionsMarkup}
    </ul>);
}
function createNormalizedOptions(options, sections, title) {
    if (options == null) {
        const section = { options: [], title };
        return sections == null ? [] : [section, ...sections];
    }
    if (sections == null) {
        return [
            {
                title,
                options,
            },
        ];
    }
    return [
        {
            title,
            options,
        },
        ...sections,
    ];
}
function isSection(arr) {
    return (typeof arr[0] === 'object' &&
        Object.prototype.hasOwnProperty.call(arr[0], 'options'));
}
function optionArraysAreEqual(firstArray, secondArray) {
    if (isSection(firstArray) && isSection(secondArray)) {
        return arraysAreEqual(firstArray, secondArray, testSectionsPropEquality);
    }
    return arraysAreEqual(firstArray, secondArray);
}
function testSectionsPropEquality(previousSection, currentSection) {
    const { options: previousOptions } = previousSection;
    const { options: currentOptions } = currentSection;
    const optionsAreEqual = arraysAreEqual(previousOptions, currentOptions);
    const titlesAreEqual = previousSection.title === currentSection.title;
    return optionsAreEqual && titlesAreEqual;
}
