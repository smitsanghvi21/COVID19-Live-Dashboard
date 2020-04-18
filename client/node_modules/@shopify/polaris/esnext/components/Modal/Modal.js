import React from 'react';
import { TransitionGroup } from '@material-ui/react-transition-group';
import { write } from '@shopify/javascript-utilities/fastdom';
import { focusFirstFocusableNode } from '@shopify/javascript-utilities/focus';
import { createUniqueIDFactory } from '@shopify/javascript-utilities/other';
import { Modal as AppBridgeModal } from '@shopify/app-bridge/actions';
import isEqual from 'lodash/isEqual';
import { WithinContentContext } from '../../utilities/within-content-context';
import { wrapWithComponent } from '../../utilities/components';
import { transformActions } from '../../utilities/app-bridge-transformers';
import { pick } from '../../utilities/pick';
import { withAppProvider, } from '../../utilities/with-app-provider';
import { Backdrop } from '../Backdrop';
import { Scrollable } from '../Scrollable';
import { Spinner } from '../Spinner';
import { Portal } from '../Portal';
import { CloseButton, Dialog, Footer, Header, Section, } from './components';
import styles from './Modal.scss';
const IFRAME_LOADING_HEIGHT = 200;
const DEFAULT_IFRAME_CONTENT_HEIGHT = 400;
const getUniqueID = createUniqueIDFactory('modal-header');
const APP_BRIDGE_PROPS = [
    'title',
    'size',
    'message',
    'src',
    'primaryAction',
    'secondaryActions',
];
class ModalInner extends React.Component {
    constructor() {
        super(...arguments);
        this.focusReturnPointNode = null;
        this.state = {
            iframeHeight: IFRAME_LOADING_HEIGHT,
        };
        this.headerId = getUniqueID();
        this.handleEntered = () => {
            const { onTransitionEnd } = this.props;
            if (onTransitionEnd) {
                onTransitionEnd();
            }
        };
        this.handleExited = () => {
            this.setState({
                iframeHeight: IFRAME_LOADING_HEIGHT,
            });
            this.focusReturnPointNode &&
                write(() => this.focusReturnPointNode &&
                    this.focusReturnPointNode instanceof HTMLElement &&
                    focusFirstFocusableNode(this.focusReturnPointNode, false));
        };
        this.handleIFrameLoad = (evt) => {
            const iframe = evt.target;
            if (iframe && iframe.contentWindow) {
                try {
                    this.setState({
                        iframeHeight: iframe.contentWindow.document.body.scrollHeight,
                    });
                }
                catch (_a) {
                    this.setState({
                        iframeHeight: DEFAULT_IFRAME_CONTENT_HEIGHT,
                    });
                }
            }
            const { onIFrameLoad } = this.props;
            if (onIFrameLoad != null) {
                onIFrameLoad(evt);
            }
        };
    }
    componentDidMount() {
        if (this.props.polaris.appBridge == null) {
            return;
        }
        // eslint-disable-next-line no-console
        console.warn('Deprecation: Using `Modal` in an embedded app is deprecated and will be removed in v5.0. Use `Modal` from `@shopify/app-bridge-react` instead: https://help.shopify.com/en/api/embedded-apps/app-bridge/react-components/modal');
        const transformProps = this.transformProps();
        if (transformProps) {
            this.appBridgeModal = AppBridgeModal.create(this.props.polaris.appBridge, transformProps);
        }
        if (this.appBridgeModal) {
            this.appBridgeModal.subscribe(AppBridgeModal.Action.CLOSE, this.props.onClose);
        }
        const { open } = this.props;
        if (open) {
            this.focusReturnPointNode = document.activeElement;
            this.appBridgeModal &&
                this.appBridgeModal.dispatch(AppBridgeModal.Action.OPEN);
        }
    }
    componentDidUpdate(prevProps) {
        if (this.props.polaris.appBridge == null || this.appBridgeModal == null) {
            return;
        }
        const { open } = this.props;
        const wasOpen = prevProps.open;
        const transformedProps = this.transformProps();
        const prevAppBridgeProps = pick(prevProps, APP_BRIDGE_PROPS);
        const currentAppBridgeProps = pick(this.props, APP_BRIDGE_PROPS);
        if (!isEqual(prevAppBridgeProps, currentAppBridgeProps) &&
            transformedProps) {
            this.appBridgeModal.set(transformedProps);
        }
        if (wasOpen !== open) {
            if (open) {
                this.appBridgeModal.dispatch(AppBridgeModal.Action.OPEN);
            }
            else {
                this.appBridgeModal.dispatch(AppBridgeModal.Action.CLOSE);
            }
        }
        if (!wasOpen && open) {
            this.focusReturnPointNode = document.activeElement;
        }
        else if (wasOpen &&
            !open &&
            this.focusReturnPointNode instanceof HTMLElement &&
            document.contains(this.focusReturnPointNode)) {
            this.focusReturnPointNode.focus();
            this.focusReturnPointNode = null;
        }
    }
    componentWillUnmount() {
        if (this.props.polaris.appBridge == null || this.appBridgeModal == null) {
            return;
        }
        this.appBridgeModal.unsubscribe();
    }
    render() {
        if (this.props.polaris.appBridge != null) {
            return null;
        }
        const { children, title, src, iFrameName, open, instant, sectioned, loading, large, limitHeight, onClose, footer, primaryAction, secondaryActions, polaris: { intl }, onScrolledToBottom, } = this.props;
        const { iframeHeight } = this.state;
        const iframeTitle = intl.translate('Polaris.Modal.iFrameTitle');
        let dialog;
        let backdrop;
        if (open) {
            const footerMarkup = !footer && !primaryAction && !secondaryActions ? null : (<Footer primaryAction={primaryAction} secondaryActions={secondaryActions}>
            {footer}
          </Footer>);
            const content = sectioned
                ? wrapWithComponent(children, Section, {})
                : children;
            const body = loading ? (<div className={styles.Spinner}>
          <Spinner />
        </div>) : (content);
            const bodyMarkup = src ? (<iframe name={iFrameName} title={iframeTitle} src={src} className={styles.IFrame} onLoad={this.handleIFrameLoad} style={{ height: `${iframeHeight}px` }}/>) : (<Scrollable shadow className={styles.Body} onScrolledToBottom={onScrolledToBottom}>
          {body}
        </Scrollable>);
            const headerMarkup = title ? (<Header id={this.headerId} onClose={onClose} testID="ModalHeader">
          {title}
        </Header>) : (<CloseButton onClick={onClose} title={false} testID="ModalCloseButton"/>);
            const labelledBy = title ? this.headerId : undefined;
            dialog = (<Dialog instant={instant} labelledBy={labelledBy} onClose={onClose} onEntered={this.handleEntered} onExited={this.handleExited} large={large} limitHeight={limitHeight}>
          {headerMarkup}
          <div className={styles.BodyWrapper}>{bodyMarkup}</div>
          {footerMarkup}
        </Dialog>);
            backdrop = <Backdrop />;
        }
        const animated = !instant;
        return (<WithinContentContext.Provider value>
        <Portal idPrefix="modal">
          <TransitionGroup appear={animated} enter={animated} exit={animated}>
            {dialog}
          </TransitionGroup>
          {backdrop}
        </Portal>
      </WithinContentContext.Provider>);
    }
    transformProps() {
        const { title, size, message, src, primaryAction, secondaryActions, polaris, } = this.props;
        const { appBridge } = polaris;
        if (!appBridge)
            return;
        const safeTitle = typeof title === 'string' ? title : undefined;
        const safeSize = size != null ? AppBridgeModal.Size[size] : undefined;
        const srcPayload = {};
        if (src != null) {
            if (/^https?:\/\//.test(src)) {
                srcPayload.url = src;
            }
            else {
                srcPayload.path = src;
            }
        }
        return Object.assign(Object.assign({ title: safeTitle, message, size: safeSize }, srcPayload), { footer: {
                buttons: transformActions(appBridge, {
                    primaryAction,
                    secondaryActions,
                }),
            } });
    }
}
ModalInner.Section = Section;
export const Modal = withAppProvider()(ModalInner);
