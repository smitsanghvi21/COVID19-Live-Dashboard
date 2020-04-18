import { __rest } from "tslib";
import React from 'react';
import debounce from 'lodash/debounce';
import { addEventListener, removeEventListener, } from '@shopify/javascript-utilities/events';
import { closest } from '@shopify/javascript-utilities/dom';
import { classNames } from '../../utilities/css';
import { StickyManager, StickyManagerContext, } from '../../utilities/sticky-manager';
import { scrollable } from '../shared';
import { ScrollTo } from './components';
import { ScrollableContext } from './context';
import styles from './Scrollable.scss';
const MAX_SCROLL_DISTANCE = 100;
const DELTA_THRESHOLD = 0.2;
const DELTA_PERCENTAGE = 0.2;
const EVENTS_TO_LOCK = ['scroll', 'touchmove', 'wheel'];
const PREFERS_REDUCED_MOTION = prefersReducedMotion();
export class Scrollable extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            topShadow: false,
            bottomShadow: false,
            scrollPosition: 0,
            canScroll: false,
        };
        this.stickyManager = new StickyManager();
        this.scrollArea = null;
        this.handleResize = debounce(() => {
            this.handleScroll();
        }, 50, { trailing: true });
        this.setScrollArea = (scrollArea) => {
            this.scrollArea = scrollArea;
        };
        this.handleScroll = () => {
            const { scrollArea } = this;
            const { shadow, onScrolledToBottom } = this.props;
            if (scrollArea == null) {
                return;
            }
            const { scrollTop, clientHeight, scrollHeight } = scrollArea;
            const shouldBottomShadow = Boolean(shadow && !(scrollTop + clientHeight >= scrollHeight));
            const shouldTopShadow = Boolean(shadow && scrollTop > 0);
            const canScroll = scrollHeight > clientHeight;
            const hasScrolledToBottom = scrollHeight - scrollTop === clientHeight;
            if (canScroll && hasScrolledToBottom && onScrolledToBottom) {
                onScrolledToBottom();
            }
            this.setState({
                topShadow: shouldTopShadow,
                bottomShadow: shouldBottomShadow,
                scrollPosition: scrollTop,
                canScroll,
            });
        };
        this.scrollHint = () => {
            const { scrollArea } = this;
            if (scrollArea == null) {
                return;
            }
            const { clientHeight, scrollHeight } = scrollArea;
            if (PREFERS_REDUCED_MOTION ||
                this.state.scrollPosition > 0 ||
                scrollHeight <= clientHeight) {
                return;
            }
            const scrollDistance = scrollHeight - clientHeight;
            this.toggleLock();
            this.setState({
                scrollPosition: scrollDistance > MAX_SCROLL_DISTANCE
                    ? MAX_SCROLL_DISTANCE
                    : scrollDistance,
            }, () => {
                window.requestAnimationFrame(this.scrollStep);
            });
        };
        this.scrollStep = () => {
            this.setState(({ scrollPosition }) => {
                const delta = scrollPosition * DELTA_PERCENTAGE;
                return {
                    scrollPosition: delta < DELTA_THRESHOLD ? 0 : scrollPosition - delta,
                };
            }, () => {
                if (this.state.scrollPosition > 0) {
                    window.requestAnimationFrame(this.scrollStep);
                }
                else {
                    this.toggleLock(false);
                }
            });
        };
        this.scrollToPosition = (scrollY) => {
            this.setState({ scrollPosition: scrollY });
        };
    }
    static forNode(node) {
        const closestElement = closest(node, scrollable.selector);
        return closestElement instanceof HTMLElement ? closestElement : document;
    }
    componentDidMount() {
        if (this.scrollArea == null) {
            return;
        }
        this.stickyManager.setContainer(this.scrollArea);
        addEventListener(this.scrollArea, 'scroll', () => {
            window.requestAnimationFrame(this.handleScroll);
        });
        addEventListener(window, 'resize', this.handleResize);
        window.requestAnimationFrame(() => {
            this.handleScroll();
            if (this.props.hint) {
                this.scrollHint();
            }
        });
    }
    componentWillUnmount() {
        if (this.scrollArea == null) {
            return;
        }
        removeEventListener(this.scrollArea, 'scroll', this.handleScroll);
        removeEventListener(window, 'resize', this.handleResize);
        this.stickyManager.removeScrollListener();
    }
    componentDidUpdate() {
        const { scrollPosition } = this.state;
        if (scrollPosition && this.scrollArea && scrollPosition > 0) {
            this.scrollArea.scrollTop = scrollPosition;
        }
    }
    render() {
        const { topShadow, bottomShadow, canScroll } = this.state;
        const _a = this.props, { children, className, horizontal, vertical = true, shadow, hint, onScrolledToBottom } = _a, rest = __rest(_a, ["children", "className", "horizontal", "vertical", "shadow", "hint", "onScrolledToBottom"]);
        const finalClassName = classNames(className, styles.Scrollable, vertical && styles.vertical, horizontal && styles.horizontal, topShadow && styles.hasTopShadow, bottomShadow && styles.hasBottomShadow, vertical && canScroll && styles.verticalHasScrolling);
        return (<ScrollableContext.Provider value={this.scrollToPosition}>
        <StickyManagerContext.Provider value={this.stickyManager}>
          <div className={finalClassName} {...scrollable.props} {...rest} ref={this.setScrollArea}>
            {children}
          </div>
        </StickyManagerContext.Provider>
      </ScrollableContext.Provider>);
    }
    toggleLock(shouldLock = true) {
        const { scrollArea } = this;
        if (scrollArea == null) {
            return;
        }
        EVENTS_TO_LOCK.forEach((eventName) => {
            if (shouldLock) {
                addEventListener(scrollArea, eventName, prevent);
            }
            else {
                removeEventListener(scrollArea, eventName, prevent);
            }
        });
    }
}
Scrollable.ScrollTo = ScrollTo;
function prevent(evt) {
    evt.preventDefault();
}
function prefersReducedMotion() {
    try {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    catch (err) {
        return false;
    }
}
