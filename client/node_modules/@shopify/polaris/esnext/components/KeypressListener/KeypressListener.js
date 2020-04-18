import { useEffect } from 'react';
import { addEventListener, removeEventListener, } from '@shopify/javascript-utilities/events';
export function KeypressListener({ keyCode, handler, keyEvent = 'keyup', }) {
    const handleKeyEvent = (event) => {
        if (event.keyCode === keyCode) {
            handler(event);
        }
    };
    useEffect(() => {
        addEventListener(document, keyEvent, handleKeyEvent);
        return () => {
            removeEventListener(document, keyEvent, handleKeyEvent);
        };
    });
    return null;
}
