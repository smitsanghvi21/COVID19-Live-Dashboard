import { FOCUSABLE_SELECTOR } from '@shopify/javascript-utilities/focus';
import { isElementInViewport } from './is-element-in-viewport';
const KEYBOARD_FOCUSABLE_SELECTORS = 'a,frame,iframe,input:not([type=hidden]):not(:disabled),select:not(:disabled),textarea:not(:disabled),button:not(:disabled),*[tabindex]:not([tabindex="-1"])';
export function handleMouseUpByBlurring({ currentTarget, }) {
    currentTarget.blur();
}
export function nextFocusableNode(node, filter) {
    const allFocusableElements = [
        ...document.querySelectorAll(FOCUSABLE_SELECTOR),
    ];
    const sliceLocation = allFocusableElements.indexOf(node) + 1;
    const focusableElementsAfterNode = allFocusableElements.slice(sliceLocation);
    for (const focusableElement of focusableElementsAfterNode) {
        if (isElementInViewport(focusableElement) &&
            (!filter || (filter && filter(focusableElement)))) {
            return focusableElement;
        }
    }
    return null;
}
// Popover needs to be able to find its activator even if it is disabled, which FOCUSABLE_SELECTOR doesn't support.
export function findFirstFocusableNode(element) {
    const focusableSelector = `a,button,frame,iframe,input:not([type=hidden]),select,textarea,*[tabindex]`;
    if (matches(element, focusableSelector)) {
        return element;
    }
    return element.querySelector(focusableSelector);
}
export function focusNextFocusableNode(node, filter) {
    const nextFocusable = nextFocusableNode(node, filter);
    if (nextFocusable && nextFocusable instanceof HTMLElement) {
        nextFocusable.focus();
        return true;
    }
    return false;
}
// https://github.com/Shopify/javascript-utilities/blob/1e705564643d6fe7ffea5ebfbbf3e6b759a66c9b/src/focus.ts
export function findFirstKeyboardFocusableNode(element, onlyDescendants = true) {
    if (!onlyDescendants && matches(element, KEYBOARD_FOCUSABLE_SELECTORS)) {
        return element;
    }
    return element.querySelector(KEYBOARD_FOCUSABLE_SELECTORS);
}
export function focusFirstKeyboardFocusableNode(element, onlyDescendants = true) {
    const firstFocusable = findFirstKeyboardFocusableNode(element, onlyDescendants);
    if (firstFocusable) {
        firstFocusable.focus();
        return true;
    }
    return false;
}
export function findLastKeyboardFocusableNode(element, onlyDescendants = true) {
    if (!onlyDescendants && matches(element, KEYBOARD_FOCUSABLE_SELECTORS)) {
        return element;
    }
    const allFocusable = element.querySelectorAll(KEYBOARD_FOCUSABLE_SELECTORS);
    return allFocusable[allFocusable.length - 1];
}
export function focusLastKeyboardFocusableNode(element, onlyDescendants = true) {
    const lastFocusable = findLastKeyboardFocusableNode(element, onlyDescendants);
    if (lastFocusable) {
        lastFocusable.focus();
        return true;
    }
    return false;
}
function matches(node, selector) {
    if (node.matches) {
        return node.matches(selector);
    }
    const matches = (node.ownerDocument || document).querySelectorAll(selector);
    let i = matches.length;
    while (--i >= 0 && matches.item(i) !== node)
        return i > -1;
}
