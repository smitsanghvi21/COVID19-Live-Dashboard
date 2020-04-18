/// <reference types="hoist-non-react-statics" />
import React from 'react';
import { WithAppProviderProps } from '../../utilities/with-app-provider';
interface State {
    isSticky: boolean;
    style: object;
}
export declare type StickyProps = {
    /** Element outlining the fixed position boundaries */
    boundingElement?: HTMLElement | null;
    /** Offset vertical spacing from the top of the scrollable container */
    offset?: boolean;
    /** Should the element remain in a fixed position when the layout is stacked (smaller screens)  */
    disableWhenStacked?: boolean;
} & ({
    children: React.ReactNode;
} | {
    children(isSticky: boolean): React.ReactNode;
});
declare type CombinedProps = StickyProps & WithAppProviderProps;
declare class StickyInner extends React.Component<CombinedProps, State> {
    state: State;
    private placeHolderNode;
    private stickyNode;
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
    private setPlaceHolderNode;
    private setStickyNode;
    private handlePositioning;
    private adjustPlaceHolderNode;
}
export declare const Sticky: React.FunctionComponent<StickyProps> & import("hoist-non-react-statics").NonReactStatics<(React.ComponentClass<CombinedProps, any> & typeof StickyInner) | (React.FunctionComponent<CombinedProps> & typeof StickyInner), {}>;
export {};
