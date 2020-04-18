import React from 'react';
export interface MediaQueryContextType {
    isNavigationCollapsed: boolean;
}
export declare const MediaQueryContext: React.Context<MediaQueryContextType | undefined>;
