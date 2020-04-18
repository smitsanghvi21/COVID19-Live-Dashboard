import React, { createRef } from 'react';
import { nodeContainsDescendant } from '@shopify/javascript-utilities/dom';
import { write } from '@shopify/javascript-utilities/fastdom';
import { durationBase } from '@shopify/polaris-tokens';
import { classNames } from '../../../../utilities/css';
import { isElementOfType, wrapWithComponent, } from '../../../../utilities/components';
import { Key } from '../../../../types';
import { overlay } from '../../../shared';
import { EventListener } from '../../../EventListener';
import { KeypressListener } from '../../../KeypressListener';
import { PositionedOverlay, } from '../../../PositionedOverlay';
import { Pane } from '../Pane';
import styles from '../../Popover.scss';
export var PopoverCloseSource;
(function (PopoverCloseSource) {
    PopoverCloseSource[PopoverCloseSource["Click"] = 0] = "Click";
    PopoverCloseSource[PopoverCloseSource["EscapeKeypress"] = 1] = "EscapeKeypress";
    PopoverCloseSource[PopoverCloseSource["FocusOut"] = 2] = "FocusOut";
    PopoverCloseSource[PopoverCloseSource["ScrollOut"] = 3] = "ScrollOut";
})(PopoverCloseSource || (PopoverCloseSource = {}));
var TransitionStatus;
(function (TransitionStatus) {
    TransitionStatus["Entering"] = "entering";
    TransitionStatus["Entered"] = "entered";
    TransitionStatus["Exiting"] = "exiting";
    TransitionStatus["Exited"] = "exited";
})(TransitionStatus || (TransitionStatus = {}));
export class PopoverOverlay extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.state = {
            transitionStatus: this.props.active
                ? TransitionStatus.Entering
                : TransitionStatus.Exited,
        };
        this.contentNode = createRef();
        this.renderPopover = (overlayDetails) => {
            const { measuring, desiredHeight, positioning } = overlayDetails;
            const { id, children, sectioned, fullWidth, fullHeight, fluidContent, } = this.props;
            const className = classNames(styles.Popover, positioning === 'above' && styles.positionedAbove, fullWidth && styles.fullWidth, measuring && styles.measuring);
            const contentStyles = measuring ? undefined : { height: desiredHeight };
            const contentClassNames = classNames(styles.Content, fullHeight && styles['Content-fullHeight'], fluidContent && styles['Content-fluidContent']);
            const content = (<div id={id} tabIndex={-1} className={contentClassNames} style={contentStyles} ref={this.contentNode}>
        {renderPopoverContent(children, { sectioned })}
      </div>);
            return (<div className={className} {...overlay.props}>
        <EventListener event="click" handler={this.handleClick}/>
        <EventListener event="touchstart" handler={this.handleClick}/>
        <KeypressListener keyCode={Key.Escape} handler={this.handleEscape}/>
        <div className={styles.FocusTracker} 
            // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
            tabIndex={0} onFocus={this.handleFocusFirstItem}/>
        <div className={styles.Wrapper}>{content}</div>
        <div className={styles.FocusTracker} 
            // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
            tabIndex={0} onFocus={this.handleFocusLastItem}/>
      </div>);
        };
        this.handleClick = (event) => {
            const target = event.target;
            const { contentNode, props: { activator, onClose }, } = this;
            const isDescendant = contentNode.current != null &&
                nodeContainsDescendant(contentNode.current, target);
            const isActivatorDescendant = nodeContainsDescendant(activator, target);
            if (isDescendant ||
                isActivatorDescendant ||
                this.state.transitionStatus !== TransitionStatus.Entered) {
                return;
            }
            onClose(PopoverCloseSource.Click);
        };
        this.handleScrollOut = () => {
            this.props.onClose(PopoverCloseSource.ScrollOut);
        };
        this.handleEscape = () => {
            this.props.onClose(PopoverCloseSource.EscapeKeypress);
        };
        this.handleFocusFirstItem = () => {
            this.props.onClose(PopoverCloseSource.FocusOut);
        };
        this.handleFocusLastItem = () => {
            this.props.onClose(PopoverCloseSource.FocusOut);
        };
    }
    changeTransitionStatus(transitionStatus, cb) {
        this.setState({ transitionStatus }, cb);
        // Forcing a reflow to enable the animation
        this.contentNode.current &&
            this.contentNode.current.getBoundingClientRect();
    }
    componentDidMount() {
        if (this.props.active) {
            this.focusContent();
            this.changeTransitionStatus(TransitionStatus.Entered);
        }
    }
    componentDidUpdate(oldProps) {
        if (this.props.active && !oldProps.active) {
            this.focusContent();
            this.changeTransitionStatus(TransitionStatus.Entering, () => {
                this.clearTransitionTimeout();
                this.enteringTimer = window.setTimeout(() => {
                    this.setState({ transitionStatus: TransitionStatus.Entered });
                }, durationBase);
            });
        }
        if (!this.props.active && oldProps.active) {
            this.changeTransitionStatus(TransitionStatus.Exiting, () => {
                this.clearTransitionTimeout();
                this.exitingTimer = window.setTimeout(() => {
                    this.setState({ transitionStatus: TransitionStatus.Exited });
                }, durationBase);
            });
        }
    }
    componentWillUnmount() {
        this.clearTransitionTimeout();
    }
    render() {
        const { active, activator, fullWidth, preferredPosition = 'below', preferredAlignment = 'center', preferInputActivator = true, fixed, } = this.props;
        const { transitionStatus } = this.state;
        if (transitionStatus === TransitionStatus.Exited && !active)
            return null;
        const className = classNames(styles.PopoverOverlay, transitionStatus === TransitionStatus.Entering &&
            styles['PopoverOverlay-entering'], transitionStatus === TransitionStatus.Entered &&
            styles['PopoverOverlay-open'], transitionStatus === TransitionStatus.Exiting &&
            styles['PopoverOverlay-exiting']);
        return (<PositionedOverlay testID="positionedOverlay" fullWidth={fullWidth} active={active} activator={activator} preferInputActivator={preferInputActivator} preferredPosition={preferredPosition} preferredAlignment={preferredAlignment} render={this.renderPopover.bind(this)} fixed={fixed} onScrollOut={this.handleScrollOut} classNames={className}/>);
    }
    clearTransitionTimeout() {
        if (this.enteringTimer) {
            window.clearTimeout(this.enteringTimer);
        }
        if (this.exitingTimer) {
            window.clearTimeout(this.exitingTimer);
        }
    }
    focusContent() {
        if (this.props.preventAutofocus) {
            return;
        }
        if (this.contentNode == null) {
            return;
        }
        write(() => {
            if (this.contentNode.current == null) {
                return;
            }
            this.contentNode.current.focus({
                preventScroll: process.env.NODE_ENV === 'development',
            });
        });
    }
}
function renderPopoverContent(children, props) {
    const childrenArray = React.Children.toArray(children);
    if (isElementOfType(childrenArray[0], Pane)) {
        return childrenArray;
    }
    return wrapWithComponent(childrenArray, Pane, props);
}
