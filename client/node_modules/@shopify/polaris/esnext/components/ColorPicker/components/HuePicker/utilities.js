import { clamp } from '@shopify/javascript-utilities/math';
const VERTICAL_PADDING = 13;
export function calculateDraggerY(hue, sliderHeight, draggerHeight) {
    const offset = offsetForHue(hue, sliderHeight, draggerHeight);
    return clamp(offset, 0, sliderHeight);
}
export function hueForDraggerY(y, sliderHeight) {
    const offsetY = clamp(y, 0, sliderHeight);
    return hueForOffset(offsetY, sliderHeight);
}
function hueForOffset(offset, sliderHeight) {
    const selectionHeight = offset - VERTICAL_PADDING;
    const slidableArea = sliderHeight - VERTICAL_PADDING * 2;
    return clamp((selectionHeight / slidableArea) * 360, 0, 360);
}
function offsetForHue(hue, sliderHeight, draggerHeight) {
    const slidableArea = sliderHeight - (draggerHeight + VERTICAL_PADDING);
    return clamp((hue / 360) * slidableArea + VERTICAL_PADDING, 0, sliderHeight - draggerHeight);
}
