import React from 'react';
import { PositionedOverlayProps } from '../../../PositionedOverlay';
export interface TooltipOverlayProps {
    id: string;
    active: boolean;
    light?: boolean;
    preferredPosition?: PositionedOverlayProps['preferredPosition'];
    children?: React.ReactNode;
    activator: HTMLElement;
    onClose(): void;
}
export declare class TooltipOverlay extends React.PureComponent<TooltipOverlayProps, never> {
    render(): JSX.Element | null;
    private renderOverlay;
    private renderTooltip;
}
