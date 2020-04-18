import { __rest } from "tslib";
import React from 'react';
import { useUniqueId } from '../../utilities/unique-id';
import { SingleThumb, DualThumb } from './components';
export function RangeSlider(_a) {
    var { min = 0, max = 100, step = 1, value } = _a, rest = __rest(_a, ["min", "max", "step", "value"]);
    const id = useUniqueId('RangeSlider');
    const sharedProps = Object.assign({ id,
        min,
        max,
        step }, rest);
    return isDualThumb(value) ? (<DualThumb value={value} {...sharedProps}/>) : (<SingleThumb value={value} {...sharedProps}/>);
}
function isDualThumb(value) {
    return Array.isArray(value);
}
