/// <reference types="hoist-non-react-statics" />
import React from 'react';
import { WithAppProviderProps } from '../../utilities/with-app-provider';
import { HeaderProps } from './components';
export interface PageProps extends HeaderProps {
    /** The contents of the page */
    children?: React.ReactNode;
    /** Remove the normal max-width on the page */
    fullWidth?: boolean;
    /** Decreases the maximum layout width. Intended for single-column layouts */
    narrowWidth?: boolean;
    /**
     * Force render in page and do not delegate to the app bridge TitleBar action
     * @default false
     * @embeddedAppOnly
     * @see {@link https://polaris.shopify.com/components/structure/page#section-use-in-an-embedded-application|Shopify Page Component docs}
     * */
    forceRender?: boolean;
    /** Decreases the maximum layout width. Intended for single-column layouts
     * @deprecated As of release 4.0, replaced by {@link https://polaris.shopify.com/components/structure/page#props-narrow-width}
     */
    singleColumn?: boolean;
}
declare type ComposedProps = PageProps & WithAppProviderProps;
declare class PageInner extends React.PureComponent<ComposedProps, never> {
    private titlebar;
    componentDidMount(): void;
    componentDidUpdate(prevProps: ComposedProps): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
    private delegateToAppbridge;
    private hasHeaderContent;
    private transformProps;
    private transformBreadcrumbs;
}
export declare const Page: React.FunctionComponent<PageProps> & import("hoist-non-react-statics").NonReactStatics<(React.ComponentClass<ComposedProps, any> & typeof PageInner) | (React.FunctionComponent<ComposedProps> & typeof PageInner), {}>;
export {};
