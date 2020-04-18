import React from 'react';
import { Section, Item } from './components';
import { SectionType } from './types';
export interface NavigationProps {
    location: string;
    sections?: SectionType[];
    children?: React.ReactNode;
    contextControl?: React.ReactNode;
    onDismiss?(): void;
}
export declare const Navigation: React.FunctionComponent<NavigationProps> & {
    Item: typeof Item;
    Section: typeof Section;
};
