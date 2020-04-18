import React, { createContext, createRef, } from 'react';
import { read } from '@shopify/javascript-utilities/fastdom';
import { classNames } from '../../utilities/css';
import styles from './Collapsible.scss';
const ParentCollapsibleExpandingContext = createContext(false);
class CollapsibleInner extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            height: null,
            animationState: 'idle',
            // eslint-disable-next-line react/no-unused-state
            open: this.props.open,
        };
        this.node = createRef();
        this.heightNode = createRef();
        this.handleTransitionEnd = (event) => {
            const { target } = event;
            if (target === this.node.current) {
                this.setState({ animationState: 'idle', height: null });
            }
        };
    }
    static getDerivedStateFromProps({ open: willOpen }, { open, animationState: prevAnimationState }) {
        let nextAnimationState = prevAnimationState;
        if (open !== willOpen) {
            nextAnimationState = 'measuring';
        }
        return {
            animationState: nextAnimationState,
            open: willOpen,
        };
    }
    componentDidUpdate({ open: wasOpen }) {
        const { animationState } = this.state;
        const parentCollapsibleExpanding = this.context;
        if (parentCollapsibleExpanding && animationState !== 'idle') {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({
                animationState: 'idle',
            });
            return;
        }
        read(() => {
            const heightNode = this.heightNode.current;
            switch (animationState) {
                case 'idle':
                    break;
                case 'measuring':
                    this.setState({
                        animationState: wasOpen ? 'closingStart' : 'openingStart',
                        height: wasOpen && heightNode ? heightNode.scrollHeight : 0,
                    });
                    break;
                case 'closingStart':
                    this.setState({
                        animationState: 'closing',
                        height: 0,
                    });
                    break;
                case 'openingStart':
                    this.setState({
                        animationState: 'opening',
                        height: heightNode ? heightNode.scrollHeight : 0,
                    });
            }
        });
    }
    render() {
        const { id, open, children, transition } = this.props;
        const { animationState, height } = this.state;
        const parentCollapsibleExpanding = this.context;
        const animating = animationState !== 'idle';
        const wrapperClassName = classNames(styles.Collapsible, open && styles.open, animating && styles.animating, !animating && open && styles.fullyOpen);
        const displayHeight = collapsibleHeight(open, animationState, height);
        const content = animating || open ? children : null;
        const transitionProperties = transition
            ? {
                transitionDuration: `${transition.duration}`,
                transitionTimingFunction: `${transition.timingFunction}`,
            }
            : null;
        return (<ParentCollapsibleExpandingContext.Provider value={parentCollapsibleExpanding || (open && animationState !== 'idle')}>
        <div id={id} aria-hidden={!open} style={Object.assign({ maxHeight: `${displayHeight}` }, transitionProperties)} className={wrapperClassName} ref={this.node} onTransitionEnd={this.handleTransitionEnd}>
          <div ref={this.heightNode}>{content}</div>
        </div>
      </ParentCollapsibleExpandingContext.Provider>);
    }
}
CollapsibleInner.contextType = ParentCollapsibleExpandingContext;
function collapsibleHeight(open, animationState, height) {
    if (animationState === 'idle' && open) {
        return open ? 'none' : undefined;
    }
    if (animationState === 'measuring') {
        return open ? undefined : 'none';
    }
    return `${height || 0}px`;
}
export const Collapsible = CollapsibleInner;
