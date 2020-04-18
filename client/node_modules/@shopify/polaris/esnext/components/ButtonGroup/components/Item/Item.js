import React from 'react';
import { useToggle } from '../../../../utilities/use-toggle';
import { classNames } from '../../../../utilities/css';
import styles from '../../ButtonGroup.scss';
export function Item({ button }) {
    const { value: focused, setTrue: forceTrueFocused, setFalse: forceFalseFocused, } = useToggle(false);
    const className = classNames(styles.Item, focused && styles['Item-focused'], button.props.plain && styles['Item-plain']);
    return (<div className={className} onFocus={forceTrueFocused} onBlur={forceFalseFocused}>
      {button}
    </div>);
}
