/// <reference types="hoist-non-react-statics" />
import React from 'react';
import { WithAppProviderProps } from '../../utilities/with-app-provider';
import { FooterProps, Section } from './components';
declare type Size = 'Small' | 'Medium' | 'Large' | 'Full';
export interface ModalProps extends FooterProps {
    /** Whether the modal is open or not */
    open: boolean;
    /** The url that will be loaded as the content of the modal */
    src?: string;
    /** The name of the modal content iframe */
    iFrameName?: string;
    /** The content for the title of the modal (embedded app use accepts string only) */
    title?: string | React.ReactNode;
    /** The content to display inside modal (stand-alone app use only) */
    children?: React.ReactNode;
    /** Inner content of the footer (stand-alone app use only) */
    footer?: React.ReactNode;
    /** Disable animations and open modal instantly (stand-alone app use only) */
    instant?: boolean;
    /** Automatically adds sections to modal (stand-alone app use only) */
    sectioned?: boolean;
    /** Increases the modal width (stand-alone app use only) */
    large?: boolean;
    /** Limits modal height on large sceens with scrolling (stand-alone app use only) */
    limitHeight?: boolean;
    /** Replaces modal content with a spinner while a background action is being performed (stand-alone app use only) */
    loading?: boolean;
    /**
     * Controls the size of the modal
     * @default 'Small'
     * @embeddedAppOnly
     */
    size?: Size;
    /**
     * Message to display inside modal
     * @embeddedAppOnly
     */
    message?: string;
    /** Callback when the modal is closed */
    onClose(): void;
    /** Callback when iframe has loaded (stand-alone app use only) */
    onIFrameLoad?(evt: React.SyntheticEvent<HTMLIFrameElement>): void;
    /** Callback when modal transition animation has ended (stand-alone app use only) */
    onTransitionEnd?(): void;
    /** Callback when the bottom of the modal content is reached */
    onScrolledToBottom?(): void;
}
declare type CombinedProps = ModalProps & WithAppProviderProps;
interface State {
    iframeHeight: number;
}
declare class ModalInner extends React.Component<CombinedProps, State> {
    static Section: typeof Section;
    focusReturnPointNode: HTMLElement | Element | null;
    state: State;
    private headerId;
    private appBridgeModal;
    componentDidMount(): void;
    componentDidUpdate(prevProps: CombinedProps): void;
    componentWillUnmount(): void;
    render(): JSX.Element | null;
    private handleEntered;
    private handleExited;
    private handleIFrameLoad;
    private transformProps;
}
export declare const Modal: React.FunctionComponent<ModalProps> & import("hoist-non-react-statics").NonReactStatics<(React.ComponentClass<CombinedProps, any> & typeof ModalInner) | (React.FunctionComponent<CombinedProps> & typeof ModalInner), {}>;
export {};
