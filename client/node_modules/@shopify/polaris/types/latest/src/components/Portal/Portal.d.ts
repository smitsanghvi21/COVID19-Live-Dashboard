import React from 'react';
import { ThemeContext } from '../../utilities/theme';
export interface PortalProps {
    children?: React.ReactNode;
    idPrefix?: string;
    onPortalCreated?(): void;
}
interface State {
    isMounted: boolean;
}
export declare class Portal extends React.PureComponent<PortalProps, State> {
    static defaultProps: {
        idPrefix: string;
    };
    static contextType: React.Context<import("../../utilities/theme/types").Theme | undefined>;
    context: React.ContextType<typeof ThemeContext>;
    state: State;
    private portalNode;
    private portalId;
    componentDidMount(): void;
    componentDidUpdate(_: PortalProps, prevState: State): void;
    componentWillUnmount(): void;
    render(): React.ReactPortal | null;
}
export {};
