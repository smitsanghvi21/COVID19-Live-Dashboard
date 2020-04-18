import React from 'react';
export interface ButtonGroupProps {
    /** Join buttons as segmented group */
    segmented?: boolean;
    /** Buttons will stretch/shrink to occupy the full width */
    fullWidth?: boolean;
    /** Remove top left and right border radius */
    connectedTop?: boolean;
    /** Button components */
    children?: React.ReactNode;
}
export declare function ButtonGroup({ children, segmented, fullWidth, connectedTop, }: ButtonGroupProps): JSX.Element;
