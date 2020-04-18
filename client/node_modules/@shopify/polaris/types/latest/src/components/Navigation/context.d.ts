import React from 'react';
interface NavigationContextType {
    location: string;
    onNavigationDismiss?(): void;
    withinContentContainer?: boolean;
}
export declare const NavigationContext: React.Context<NavigationContextType>;
export {};
