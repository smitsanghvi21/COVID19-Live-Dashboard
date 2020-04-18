import React from 'react';
import { classNames } from '../../../../../../utilities/css';
import styles from '../../ConnectedFilterControl.scss';
export class Item extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.state = { focused: false };
        this.handleBlur = () => {
            this.setState({ focused: false });
        };
        this.handleFocus = () => {
            this.setState({ focused: true });
        };
    }
    render() {
        const { focused } = this.state;
        const { children } = this.props;
        const className = classNames(styles.Item, focused && styles['Item-focused']);
        return (<div onBlur={this.handleBlur} onFocus={this.handleFocus} className={className}>
        {children}
      </div>);
    }
}
