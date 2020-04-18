import { __rest } from "tslib";
import React from 'react';
import { Button } from './Button';
export function buttonsFrom(actions, overrides = {}) {
    if (Array.isArray(actions)) {
        return actions.map((action, index) => buttonFrom(action, overrides, index));
    }
    else {
        const action = actions;
        return buttonFrom(action, overrides);
    }
}
export function buttonFrom(_a, overrides, key) {
    var { content, onAction } = _a, action = __rest(_a, ["content", "onAction"]);
    return (<Button key={key} onClick={onAction} {...action} {...overrides}>
      {content}
    </Button>);
}
