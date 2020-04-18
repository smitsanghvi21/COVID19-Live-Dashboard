/// <reference types="react" />
export interface SpinnerProps {
    onChange(delta: number): void;
    onClick?(): void;
    onMouseDown(onChange: Function): void;
    onMouseUp(): void;
}
export declare function Spinner({ onChange, onClick, onMouseDown, onMouseUp, }: SpinnerProps): JSX.Element;
