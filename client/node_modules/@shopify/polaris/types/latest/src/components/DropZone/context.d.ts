import React from 'react';
interface DropZoneContextType {
    disabled: boolean;
    focused: boolean;
    measuring: boolean;
    size: string;
    type: string;
}
export declare const DropZoneContext: React.Context<DropZoneContextType>;
export {};
