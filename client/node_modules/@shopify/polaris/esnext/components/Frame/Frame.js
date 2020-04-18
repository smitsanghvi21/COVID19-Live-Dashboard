import React, { createRef } from 'react';
import { MobileCancelMajorMonotone } from '@shopify/polaris-icons';
import { durationSlow } from '@shopify/polaris-tokens';
import { CSSTransition } from '@material-ui/react-transition-group';
import { FeaturesContext } from '../../utilities/features';
import { classNames } from '../../utilities/css';
import { Icon } from '../Icon';
import { EventListener } from '../EventListener';
import { withAppProvider, } from '../../utilities/with-app-provider';
import { Backdrop } from '../Backdrop';
import { TrapFocus } from '../TrapFocus';
import { dataPolarisTopBar, layer } from '../shared';
import { setRootProperty } from '../../utilities/set-root-property';
import { FrameContext, } from '../../utilities/frame';
import { ToastManager, Loading, ContextualSaveBar, CSSAnimation, } from './components';
import styles from './Frame.scss';
const GLOBAL_RIBBON_CUSTOM_PROPERTY = '--global-ribbon-height';
const APP_FRAME_MAIN = 'AppFrameMain';
const APP_FRAME_MAIN_ANCHOR_TARGET = 'AppFrameMainContent';
const APP_FRAME_NAV = 'AppFrameNav';
const APP_FRAME_TOP_BAR = 'AppFrameTopBar';
const APP_FRAME_LOADING_BAR = 'AppFrameLoadingBar';
class FrameInner extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.state = {
            skipFocused: false,
            globalRibbonHeight: 0,
            loadingStack: 0,
            toastMessages: [],
            showContextualSaveBar: false,
        };
        this.contextualSaveBar = null;
        this.globalRibbonContainer = null;
        this.navigationNode = createRef();
        this.skipToMainContentTargetNode = this.props.skipToContentTarget || React.createRef();
        this.setGlobalRibbonHeight = () => {
            const { globalRibbonContainer } = this;
            if (globalRibbonContainer) {
                this.setState({
                    globalRibbonHeight: globalRibbonContainer.offsetHeight,
                }, this.setGlobalRibbonRootProperty);
            }
        };
        this.setGlobalRibbonRootProperty = () => {
            const { globalRibbonHeight } = this.state;
            setRootProperty(GLOBAL_RIBBON_CUSTOM_PROPERTY, `${globalRibbonHeight}px`, null);
        };
        this.showToast = (toast) => {
            this.setState(({ toastMessages }) => {
                const hasToastById = toastMessages.find(({ id }) => id === toast.id) != null;
                return {
                    toastMessages: hasToastById ? toastMessages : [...toastMessages, toast],
                };
            });
        };
        this.hideToast = ({ id }) => {
            this.setState(({ toastMessages }) => {
                return {
                    toastMessages: toastMessages.filter(({ id: toastId }) => id !== toastId),
                };
            });
        };
        this.setContextualSaveBar = (props) => {
            const { showContextualSaveBar } = this.state;
            this.contextualSaveBar = Object.assign({}, props);
            if (showContextualSaveBar === true) {
                this.forceUpdate();
            }
            else {
                this.setState({ showContextualSaveBar: true });
            }
        };
        this.removeContextualSaveBar = () => {
            this.contextualSaveBar = null;
            this.setState({ showContextualSaveBar: false });
        };
        this.startLoading = () => {
            this.setState(({ loadingStack }) => ({
                loadingStack: loadingStack + 1,
            }));
        };
        this.stopLoading = () => {
            this.setState(({ loadingStack }) => ({
                loadingStack: Math.max(0, loadingStack - 1),
            }));
        };
        this.handleResize = () => {
            if (this.props.globalRibbon) {
                this.setGlobalRibbonHeight();
            }
        };
        this.handleFocus = () => {
            this.setState({ skipFocused: true });
        };
        this.handleBlur = () => {
            this.setState({ skipFocused: false });
        };
        this.handleClick = () => {
            this.skipToMainContentTargetNode.current &&
                this.skipToMainContentTargetNode.current.focus();
        };
        this.handleNavigationDismiss = () => {
            const { onNavigationDismiss } = this.props;
            if (onNavigationDismiss != null) {
                onNavigationDismiss();
            }
        };
        this.setGlobalRibbonContainer = (node) => {
            this.globalRibbonContainer = node;
        };
        this.handleNavKeydown = (event) => {
            const { key } = event;
            const { polaris: { mediaQuery: { isNavigationCollapsed }, }, showMobileNavigation, } = this.props;
            const mobileNavShowing = isNavigationCollapsed && showMobileNavigation;
            if (mobileNavShowing && key === 'Escape') {
                this.handleNavigationDismiss();
            }
        };
        this.findNavigationNode = () => {
            return this.navigationNode.current;
        };
    }
    componentDidMount() {
        this.handleResize();
        if (this.props.globalRibbon) {
            return;
        }
        this.setGlobalRibbonRootProperty();
    }
    componentDidUpdate(prevProps) {
        if (this.props.globalRibbon !== prevProps.globalRibbon) {
            this.setGlobalRibbonHeight();
        }
    }
    render() {
        const { skipFocused, loadingStack, toastMessages, showContextualSaveBar, } = this.state;
        const { children, navigation, topBar, globalRibbon, showMobileNavigation = false, skipToContentTarget, polaris: { intl, mediaQuery: { isNavigationCollapsed }, }, } = this.props;
        const { newDesignLanguage } = this.context || {};
        const navClassName = classNames(styles.Navigation, showMobileNavigation && styles['Navigation-visible'], newDesignLanguage && styles['Navigation-newDesignLanguage']);
        const mobileNavHidden = isNavigationCollapsed && !showMobileNavigation;
        const mobileNavShowing = isNavigationCollapsed && showMobileNavigation;
        const tabIndex = mobileNavShowing ? 0 : -1;
        const navigationMarkup = navigation ? (<TrapFocus trapping={mobileNavShowing}>
        <CSSTransition findDOMNode={this.findNavigationNode} appear={isNavigationCollapsed} exit={isNavigationCollapsed} in={showMobileNavigation} timeout={durationSlow} classNames={navTransitionClasses}>
          <div ref={this.navigationNode} className={navClassName} onKeyDown={this.handleNavKeydown} id={APP_FRAME_NAV} key="NavContent" hidden={mobileNavHidden}>
            {navigation}
            <button type="button" className={styles.NavigationDismiss} onClick={this.handleNavigationDismiss} aria-hidden={mobileNavHidden ||
            (!isNavigationCollapsed && !showMobileNavigation)} aria-label={intl.translate('Polaris.Frame.Navigation.closeMobileNavigationLabel')} tabIndex={tabIndex}>
              <Icon source={MobileCancelMajorMonotone} color="white"/>
            </button>
          </div>
        </CSSTransition>
      </TrapFocus>) : null;
        const loadingMarkup = loadingStack > 0 ? (<div className={styles.LoadingBar} id={APP_FRAME_LOADING_BAR}>
          <Loading />
        </div>) : null;
        const contextualSaveBarClassName = classNames(styles.ContextualSaveBar, newDesignLanguage && styles['ContextualSaveBar-newDesignLanguage']);
        const contextualSaveBarMarkup = (<CSSAnimation in={showContextualSaveBar} className={contextualSaveBarClassName} type={newDesignLanguage ? 'fadeUp' : 'fade'}>
        <ContextualSaveBar {...this.contextualSaveBar}/>
      </CSSAnimation>);
        const topBarClassName = classNames(styles.TopBar, newDesignLanguage && styles['TopBar-newDesignLanguage']);
        const topBarMarkup = topBar ? (<div className={topBarClassName} {...layer.props} {...dataPolarisTopBar.props} id={APP_FRAME_TOP_BAR}>
        {topBar}
      </div>) : null;
        const globalRibbonClassName = classNames(styles.GlobalRibbonContainer, newDesignLanguage && styles['GlobalRibbonContainer-newDesignLanguage']);
        const globalRibbonMarkup = globalRibbon ? (<div className={globalRibbonClassName} ref={this.setGlobalRibbonContainer}>
        {globalRibbon}
      </div>) : null;
        const skipClassName = classNames(styles.Skip, skipFocused && styles.focused);
        const skipTarget = skipToContentTarget
            ? (skipToContentTarget.current && skipToContentTarget.current.id) || ''
            : APP_FRAME_MAIN_ANCHOR_TARGET;
        const skipMarkup = (<div className={skipClassName}>
        <a href={`#${skipTarget}`} onFocus={this.handleFocus} onBlur={this.handleBlur} onClick={this.handleClick} className={styles.SkipAnchor}>
          {intl.translate('Polaris.Frame.skipToContent')}
        </a>
      </div>);
        const navigationAttributes = navigation
            ? {
                'data-has-navigation': true,
            }
            : {};
        const frameClassName = classNames(styles.Frame, navigation && styles.hasNav, topBar && styles.hasTopBar);
        const mainClassName = classNames(styles.Main, newDesignLanguage && styles['Main-newDesignLanguage']);
        const navigationOverlayMarkup = showMobileNavigation && isNavigationCollapsed ? (<Backdrop belowNavigation onClick={this.handleNavigationDismiss} onTouchStart={this.handleNavigationDismiss}/>) : null;
        const skipToMainContentTarget = skipToContentTarget ? null : (
        // eslint-disable-next-line jsx-a11y/anchor-is-valid
        <a id={APP_FRAME_MAIN_ANCHOR_TARGET} ref={this.skipToMainContentTargetNode} tabIndex={-1}/>);
        const context = {
            showToast: this.showToast,
            hideToast: this.hideToast,
            startLoading: this.startLoading,
            stopLoading: this.stopLoading,
            setContextualSaveBar: this.setContextualSaveBar,
            removeContextualSaveBar: this.removeContextualSaveBar,
        };
        return (<FrameContext.Provider value={context}>
        <div className={frameClassName} {...layer.props} {...navigationAttributes}>
          {skipMarkup}
          {topBarMarkup}
          {navigationMarkup}
          {contextualSaveBarMarkup}
          {loadingMarkup}
          {navigationOverlayMarkup}
          <main className={mainClassName} id={APP_FRAME_MAIN} data-has-global-ribbon={Boolean(globalRibbon)}>
            {skipToMainContentTarget}
            <div className={styles.Content}>{children}</div>
          </main>
          <ToastManager toastMessages={toastMessages}/>
          {globalRibbonMarkup}
          <EventListener event="resize" handler={this.handleResize}/>
        </div>
      </FrameContext.Provider>);
    }
}
FrameInner.contextType = FeaturesContext;
const navTransitionClasses = {
    enter: classNames(styles['Navigation-enter']),
    enterActive: classNames(styles['Navigation-enterActive']),
    enterDone: classNames(styles['Navigation-enterActive']),
    exit: classNames(styles['Navigation-exit']),
    exitActive: classNames(styles['Navigation-exitActive']),
};
export const Frame = withAppProvider()(FrameInner);
