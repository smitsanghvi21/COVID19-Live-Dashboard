import { __rest } from "tslib";
import React from 'react';
import { classNames } from '../../../../utilities/css';
import { FeaturesContext } from '../../../../utilities/features';
import { Item } from '../Item';
import styles from '../../Tabs.scss';
export class List extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.handleKeypress = (event) => {
            const { onKeyPress = noop } = this.props;
            onKeyPress(event);
        };
    }
    render() {
        const { newDesignLanguage } = this.context || {};
        const { focusIndex, disclosureTabs, onClick = noop } = this.props;
        const tabs = disclosureTabs.map((_a, index) => {
            var { id, content } = _a, tabProps = __rest(_a, ["id", "content"]);
            return (<Item {...tabProps} key={id} id={id} focused={index === focusIndex} onClick={onClick.bind(null, id)}>
          {content}
        </Item>);
        });
        const classname = classNames(styles.List, newDesignLanguage && styles.newDesignLanguage);
        return (<ul className={classname} onKeyDown={handleKeyDown} onKeyUp={this.handleKeypress}>
        {tabs}
      </ul>);
    }
}
List.contextType = FeaturesContext;
function noop() { }
function handleKeyDown(event) {
    const { key } = event;
    if (key === 'ArrowUp' ||
        key === 'ArrowDown' ||
        key === 'ArrowLeft' ||
        key === 'ArrowRight') {
        event.preventDefault();
        event.stopPropagation();
    }
}
