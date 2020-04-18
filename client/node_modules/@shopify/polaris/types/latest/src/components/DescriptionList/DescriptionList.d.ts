import React from 'react';
interface Item {
    /** Title of the item */
    term: React.ReactNode;
    /**  Item content */
    description: React.ReactNode;
}
export interface DescriptionListProps {
    /** Collection of items for list */
    items: Item[];
}
export declare function DescriptionList({ items }: DescriptionListProps): JSX.Element;
export {};
