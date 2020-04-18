import React from 'react';
import { TooltipOverlayProps } from './components';
export interface TooltipProps {
    /** The element that will activate to tooltip */
    children?: React.ReactNode;
    /** The content to display within the tooltip */
    content: string;
    /** Display tooltip with a light background */
    light?: boolean;
    /** Toggle whether the tooltip is visible */
    active?: boolean;
    /**
     * The direction the tooltip tries to display
     * @default 'below'
     */
    preferredPosition?: TooltipOverlayProps['preferredPosition'];
    /**
     * The element type to wrap the activator in
     * @default 'span'
     */
    activatorWrapper?: string;
}
export declare function Tooltip({ children, content, light, active: originalActive, preferredPosition, activatorWrapper, }: TooltipProps): JSX.Element;
