/// <reference types="react" />
declare type Filter = (element: Element) => void;
export declare function handleMouseUpByBlurring({ currentTarget, }: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>): void;
export declare function nextFocusableNode(node: HTMLElement, filter?: Filter): HTMLElement | Element | null;
export declare function findFirstFocusableNode(element: HTMLElement): HTMLElement | null;
export declare function focusNextFocusableNode(node: HTMLElement, filter?: Filter): boolean;
export declare function findFirstKeyboardFocusableNode(element: HTMLElement, onlyDescendants?: boolean): HTMLElement | null;
export declare function focusFirstKeyboardFocusableNode(element: HTMLElement, onlyDescendants?: boolean): boolean;
export declare function findLastKeyboardFocusableNode(element: HTMLElement, onlyDescendants?: boolean): HTMLElement | null;
export declare function focusLastKeyboardFocusableNode(element: HTMLElement, onlyDescendants?: boolean): boolean;
export {};
