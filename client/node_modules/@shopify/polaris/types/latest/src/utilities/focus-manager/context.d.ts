import React from 'react';
export interface FocusManagerContextType {
    trapFocusList: string[];
    add: (id: string) => void;
    remove: (id: string) => boolean;
}
export declare const FocusManagerContext: React.Context<FocusManagerContextType | undefined>;
