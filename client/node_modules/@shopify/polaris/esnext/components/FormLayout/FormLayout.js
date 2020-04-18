import React, { memo } from 'react';
import { wrapWithComponent, isElementOfType } from '../../utilities/components';
import { Group, Item } from './components';
import styles from './FormLayout.scss';
export const FormLayout = memo(function FormLayout({ children, }) {
    return (<div className={styles.FormLayout}>
      {React.Children.map(children, wrapChildren)}
    </div>);
});
FormLayout.Group = Group;
function wrapChildren(child, index) {
    if (isElementOfType(child, Group)) {
        return child;
    }
    const props = { key: index };
    return wrapWithComponent(child, Item, props);
}
