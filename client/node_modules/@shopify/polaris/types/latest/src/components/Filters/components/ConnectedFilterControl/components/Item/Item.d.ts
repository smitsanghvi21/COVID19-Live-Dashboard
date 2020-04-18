import React from 'react';
interface ItemProps {
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
