import React from 'react';
declare type ItemPosition = 'left' | 'right' | 'primary';
export interface ItemProps {
    /** Position of the item */
    position: ItemPosition;
    /** Item content */
    children?: React.ReactNode;
}
interface State {
    focused: boolean;
}
export declare class Item extends React.PureComponent<ItemProps, State> {
    state: State;
    render(): JSX.Element;
    private handleBlur;
    private handleFocus;
}
export {};
