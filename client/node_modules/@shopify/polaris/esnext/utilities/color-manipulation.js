import { clamp } from '@shopify/javascript-utilities/math';
export function lightenColor(color, lighten = 0) {
    if (typeof color === 'string') {
        return color;
    }
    const { lightness } = color;
    const nextLightness = lightness + lighten;
    return Object.assign(Object.assign({}, color), { lightness: clamp(nextLightness, 0, 100) });
}
export function darkenColor(color, lighten = 0) {
    if (typeof color === 'string') {
        return color;
    }
    const { lightness } = color;
    const nextLightness = lightness - lighten;
    return Object.assign(Object.assign({}, color), { lightness: clamp(nextLightness, 0, 100) });
}
export function saturateColor(color, saturate = 0) {
    if (typeof color === 'string') {
        return color;
    }
    const { saturation } = color;
    const nextSaturation = saturation + saturate;
    return Object.assign(Object.assign({}, color), { saturation: nextSaturation });
}
export function createDarkColor(color, darkness, saturation) {
    const darkenedColor = darkenColor(color, darkness);
    const saturatedColor = saturateColor(darkenedColor, saturation);
    return saturatedColor;
}
export function createLightColor(color, lightness, saturation) {
    const lightenedColor = lightenColor(color, lightness);
    const saturatedColor = saturateColor(lightenedColor, -saturation);
    return saturatedColor;
}
