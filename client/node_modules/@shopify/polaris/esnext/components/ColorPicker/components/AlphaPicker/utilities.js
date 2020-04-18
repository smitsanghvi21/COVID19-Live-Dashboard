import { clamp } from '@shopify/javascript-utilities/math';
const VERTICAL_PADDING = 13;
export function calculateDraggerY(alpha, sliderHeight, draggerHeight) {
    const offset = offsetForAlpha(alpha, sliderHeight, draggerHeight);
    return clamp(offset, 0, sliderHeight);
}
export function alphaForDraggerY(y, sliderHeight) {
    const offsetY = clamp(y, 0, sliderHeight);
    return alphaForOffset(offsetY, sliderHeight);
}
export function alphaForOffset(offset, sliderHeight) {
    const selectionHeight = offset - VERTICAL_PADDING;
    const slidableArea = sliderHeight - VERTICAL_PADDING * 2;
    return clamp(1 - selectionHeight / slidableArea, 0, 1);
}
function offsetForAlpha(alpha, sliderHeight, draggerHeight) {
    const slidableArea = sliderHeight - (draggerHeight + VERTICAL_PADDING);
    return clamp((1 - alpha) * slidableArea + VERTICAL_PADDING, 0, sliderHeight - draggerHeight);
}
