import React from 'react';
import { classNames, variationName } from '../../utilities/css';
import { Item } from './components';
import styles from './List.scss';
export class List extends React.PureComponent {
    render() {
        const { children, type = 'bullet' } = this.props;
        const className = classNames(styles.List, type && styles[variationName('type', type)]);
        const ListElement = type === 'bullet' ? 'ul' : 'ol';
        return <ListElement className={className}>{children}</ListElement>;
    }
}
List.Item = Item;
