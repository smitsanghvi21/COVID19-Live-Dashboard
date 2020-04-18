/// <reference types="hoist-non-react-statics" />
import React from 'react';
import { FeaturesContext } from '../../utilities/features';
import { WithAppProviderProps } from '../../utilities/with-app-provider';
import { ToastPropsWithID } from '../../utilities/frame';
export interface FrameProps {
    /** The content to display inside the frame. */
    children?: React.ReactNode;
    /** Accepts a top bar component that will be rendered at the top-most portion of an application frame */
    topBar?: React.ReactNode;
    /** Accepts a navigation component that will be rendered in the left sidebar of an application frame */
    navigation?: React.ReactNode;
    /** Accepts a global ribbon component that will be rendered fixed to the bottom of an application frame */
    globalRibbon?: React.ReactNode;
    /** A boolean property indicating whether the mobile navigation is currently visible
     * @default false
     */
    showMobileNavigation?: boolean;
    /** Accepts a ref to the html anchor element you wish to focus when clicking the skip to content link */
    skipToContentTarget?: React.RefObject<HTMLAnchorElement>;
    /** A callback function to handle clicking the mobile navigation dismiss button */
    onNavigationDismiss?(): void;
}
interface State {
    skipFocused?: boolean;
    globalRibbonHeight: number;
    loadingStack: number;
    toastMessages: ToastPropsWithID[];
    showContextualSaveBar: boolean;
}
declare type CombinedProps = FrameProps & WithAppProviderProps;
declare class FrameInner extends React.PureComponent<CombinedProps, State> {
    static contextType: React.Context<import("../../utilities/features").Features | undefined>;
    context: React.ContextType<typeof FeaturesContext>;
    state: State;
    private contextualSaveBar;
    private globalRibbonContainer;
    private navigationNode;
    private skipToMainContentTargetNode;
    componentDidMount(): void;
    componentDidUpdate(prevProps: FrameProps): void;
    render(): JSX.Element;
    private setGlobalRibbonHeight;
    private setGlobalRibbonRootProperty;
    private showToast;
    private hideToast;
    private setContextualSaveBar;
    private removeContextualSaveBar;
    private startLoading;
    private stopLoading;
    private handleResize;
    private handleFocus;
    private handleBlur;
    private handleClick;
    private handleNavigationDismiss;
    private setGlobalRibbonContainer;
    private handleNavKeydown;
    private findNavigationNode;
}
export declare const Frame: React.FunctionComponent<FrameProps> & import("hoist-non-react-statics").NonReactStatics<(React.ComponentClass<CombinedProps, any> & typeof FrameInner) | (React.FunctionComponent<CombinedProps> & typeof FrameInner), {}>;
export {};
