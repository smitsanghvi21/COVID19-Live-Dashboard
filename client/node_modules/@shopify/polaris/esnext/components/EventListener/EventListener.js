import { __rest } from "tslib";
import React from 'react';
import { addEventListener, removeEventListener, } from '@shopify/javascript-utilities/events';
// see https://github.com/oliviertassinari/react-event-listener/
export class EventListener extends React.PureComponent {
    componentDidMount() {
        this.attachListener();
    }
    componentDidUpdate(_a) {
        var { passive } = _a, detachProps = __rest(_a, ["passive"]);
        this.detachListener(detachProps);
        this.attachListener();
    }
    componentWillUnmount() {
        this.detachListener();
    }
    render() {
        return null;
    }
    attachListener() {
        const { event, handler, capture, passive } = this.props;
        addEventListener(window, event, handler, { capture, passive });
    }
    detachListener(prevProps) {
        const { event, handler, capture } = prevProps || this.props;
        removeEventListener(window, event, handler, capture);
    }
}
