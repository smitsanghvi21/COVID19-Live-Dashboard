import React from 'react';
import { getRectForNode } from '@shopify/javascript-utilities/geometry';
import { withAppProvider, } from '../../utilities/with-app-provider';
class StickyInner extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            isSticky: false,
            style: {},
        };
        this.placeHolderNode = null;
        this.stickyNode = null;
        this.setPlaceHolderNode = (node) => {
            this.placeHolderNode = node;
        };
        this.setStickyNode = (node) => {
            this.stickyNode = node;
        };
        this.handlePositioning = (stick, top = 0, left = 0, width = 0) => {
            const { isSticky } = this.state;
            if ((stick && !isSticky) || (!stick && isSticky)) {
                this.adjustPlaceHolderNode(stick);
                this.setState({ isSticky: !isSticky });
            }
            const style = stick
                ? {
                    position: 'fixed',
                    top,
                    left,
                    width,
                }
                : {};
            this.setState({ style });
        };
        this.adjustPlaceHolderNode = (add) => {
            if (this.placeHolderNode && this.stickyNode) {
                this.placeHolderNode.style.paddingBottom = add
                    ? `${getRectForNode(this.stickyNode).height}px`
                    : '0px';
            }
        };
    }
    componentDidMount() {
        const { boundingElement, offset = false, disableWhenStacked = false, polaris: { stickyManager }, } = this.props;
        if (!this.stickyNode || !this.placeHolderNode)
            return;
        stickyManager.registerStickyItem({
            stickyNode: this.stickyNode,
            placeHolderNode: this.placeHolderNode,
            handlePositioning: this.handlePositioning,
            offset,
            boundingElement,
            disableWhenStacked,
        });
    }
    componentWillUnmount() {
        const { stickyManager } = this.props.polaris;
        if (!this.stickyNode)
            return;
        stickyManager.unregisterStickyItem(this.stickyNode);
    }
    render() {
        const { style, isSticky } = this.state;
        const { children } = this.props;
        const childrenContent = isFunction(children)
            ? children(isSticky)
            : children;
        return (<div>
        <div ref={this.setPlaceHolderNode}/>
        <div ref={this.setStickyNode} style={style}>
          {childrenContent}
        </div>
      </div>);
    }
}
function isFunction(arg) {
    return typeof arg === 'function';
}
export const Sticky = withAppProvider()(StickyInner);
