import { __rest } from "tslib";
import React, { useRef, useEffect, useCallback, useState, } from 'react';
import { findFirstFocusableNode, focusNextFocusableNode, } from '../../utilities/focus';
import { Portal } from '../Portal';
import { portal } from '../shared';
import { useUniqueId } from '../../utilities/unique-id';
import { PopoverCloseSource, Pane, PopoverOverlay, Section, } from './components';
import { setActivatorAttributes } from './set-activator-attributes';
export { PopoverCloseSource };
// TypeScript can't generate types that correctly infer the typing of
// subcomponents so explicitly state the subcomponents in the type definition.
// Letting this be implicit works in this project but fails in projects that use
// generated *.d.ts files.
export const Popover = function Popover(_a) {
    var { activatorWrapper = 'div', children, onClose, activator, active, fixed, ariaHaspopup, preferInputActivator = true } = _a, rest = __rest(_a, ["activatorWrapper", "children", "onClose", "activator", "active", "fixed", "ariaHaspopup", "preferInputActivator"]);
    const [activatorNode, setActivatorNode] = useState();
    const activatorContainer = useRef(null);
    const WrapperComponent = activatorWrapper;
    const id = useUniqueId('popover');
    const setAccessibilityAttributes = useCallback(() => {
        if (activatorContainer.current == null) {
            return;
        }
        const firstFocusable = findFirstFocusableNode(activatorContainer.current);
        const focusableActivator = firstFocusable || activatorContainer.current;
        const activatorDisabled = 'disabled' in focusableActivator && Boolean(focusableActivator.disabled);
        setActivatorAttributes(focusableActivator, {
            id,
            active,
            ariaHaspopup,
            activatorDisabled,
        });
    }, [id, active, ariaHaspopup]);
    const handleClose = (source) => {
        onClose(source);
        if (activatorContainer.current == null) {
            return;
        }
        if ((source === PopoverCloseSource.FocusOut ||
            source === PopoverCloseSource.EscapeKeypress) &&
            activatorNode) {
            const focusableActivator = findFirstFocusableNode(activatorNode) ||
                findFirstFocusableNode(activatorContainer.current) ||
                activatorContainer.current;
            if (!focusNextFocusableNode(focusableActivator, isInPortal)) {
                focusableActivator.focus();
            }
        }
    };
    useEffect(() => {
        if (!activatorNode && activatorContainer.current) {
            setActivatorNode(activatorContainer.current.firstElementChild);
        }
        else if (activatorNode &&
            activatorContainer.current &&
            !activatorContainer.current.contains(activatorNode)) {
            setActivatorNode(activatorContainer.current.firstElementChild);
        }
        setAccessibilityAttributes();
    }, [activatorNode, setAccessibilityAttributes]);
    useEffect(() => {
        if (activatorNode && activatorContainer.current) {
            setActivatorNode(activatorContainer.current.firstElementChild);
        }
        setAccessibilityAttributes();
    }, [activatorNode, setAccessibilityAttributes]);
    const portal = activatorNode ? (<Portal idPrefix="popover">
      <PopoverOverlay id={id} activator={activatorNode} preferInputActivator={preferInputActivator} onClose={handleClose} active={active} fixed={fixed} {...rest}>
        {children}
      </PopoverOverlay>
    </Portal>) : null;
    return (<WrapperComponent ref={activatorContainer}>
      {React.Children.only(activator)}
      {portal}
    </WrapperComponent>);
};
function isInPortal(element) {
    let parentElement = element.parentElement;
    while (parentElement) {
        if (parentElement.matches(portal.selector))
            return false;
        parentElement = parentElement.parentElement;
    }
    return true;
}
Popover.Pane = Pane;
Popover.Section = Section;
