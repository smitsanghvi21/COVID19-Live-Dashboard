import React from 'react';
declare type AnimationType = 'fade' | 'fadeUp';
export interface CSSAnimationProps {
    in: boolean;
    className: string;
    type: AnimationType;
    children?: React.ReactNode;
}
export declare function CSSAnimation({ in: inProp, className, type, children, }: CSSAnimationProps): JSX.Element;
export {};
