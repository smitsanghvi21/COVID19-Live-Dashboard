import React, { memo } from 'react';
import { classNames, variationName } from '../../utilities/css';
import { elementChildren, wrapWithComponent } from '../../utilities/components';
import { Item } from './components';
import styles from './Stack.scss';
export const Stack = memo(function Stack({ children, vertical, spacing, distribution, alignment, wrap, }) {
    const className = classNames(styles.Stack, vertical && styles.vertical, spacing && styles[variationName('spacing', spacing)], distribution && styles[variationName('distribution', distribution)], alignment && styles[variationName('alignment', alignment)], wrap === false && styles.noWrap);
    const itemMarkup = elementChildren(children).map((child, index) => {
        const props = { key: index };
        return wrapWithComponent(child, Item, props);
    });
    return <div className={className}>{itemMarkup}</div>;
});
Stack.Item = Item;
