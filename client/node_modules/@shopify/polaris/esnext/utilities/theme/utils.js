import { __rest } from "tslib";
import tokens from '@shopify/polaris-tokens';
import { colorFactory } from '@shopify/polaris-tokens/dist-modern';
import { mergeConfigs } from '@shopify/polaris-tokens/dist-modern/utils';
import { config as base } from '@shopify/polaris-tokens/dist-modern/configs/base';
import { colorToHsla, hslToString, hslToRgb } from '../color-transformers';
import { isLight } from '../color-validation';
import { constructColorName } from '../color-names';
import { createLightColor } from '../color-manipulation';
import { compose } from '../compose';
import { needsVariantList } from './config';
export function buildCustomProperties(themeConfig, newDesignLanguage, tokens) {
    const { colors = {}, colorScheme, config, frameOffset = 0 } = themeConfig;
    const mergedConfig = mergeConfigs(base, config || {});
    return newDesignLanguage
        ? customPropertyTransformer(Object.assign(Object.assign(Object.assign({}, colorFactory(colors, colorScheme, mergedConfig)), tokens), { frameOffset: `${frameOffset}px` }))
        : Object.assign(Object.assign({}, buildLegacyColors(themeConfig)), customPropertyTransformer({ frameOffset: `${frameOffset}px` }));
}
export function buildThemeContext(themeConfig, cssCustomProperties) {
    const { logo, colors = {}, colorScheme } = themeConfig;
    const { topBar } = colors, newDesignLanguageColors = __rest(colors, ["topBar"]);
    return {
        logo,
        cssCustomProperties: toString(cssCustomProperties),
        colors: newDesignLanguageColors,
        colorScheme,
    };
}
function toString(obj) {
    if (obj) {
        return Object.entries(obj)
            .map((pair) => pair.join(':'))
            .join(';');
    }
    else {
        return undefined;
    }
}
function customPropertyTransformer(properties) {
    return Object.entries(properties).reduce((transformed, [key, value]) => (Object.assign(Object.assign({}, transformed), { [toCssCustomPropertySyntax(key)]: value })), {});
}
export function toCssCustomPropertySyntax(camelCase) {
    return `--p-${camelCase.replace(/([A-Z0-9])/g, '-$1').toLowerCase()}`;
}
function buildLegacyColors(theme) {
    let colorPairs;
    const colors = theme && theme.colors && theme.colors.topBar
        ? theme.colors.topBar
        : { background: '#00848e', backgroundLighter: '#1d9ba4', color: '#f9fafb' };
    const colorKey = 'topBar';
    const colorKeys = Object.keys(colors);
    if (colorKeys.length > 1) {
        colorPairs = colorKeys.map((key) => {
            return [constructColorName(colorKey, key), colors[key]];
        });
    }
    else {
        colorPairs = parseColors([colorKey, colors]);
    }
    return colorPairs.reduce((state, [key, value]) => (Object.assign(Object.assign({}, state), { [key]: value })), {});
}
export function needsVariant(name) {
    return needsVariantList.includes(name);
}
const lightenToString = compose(hslToString, createLightColor);
export function setTextColor(name, variant = 'dark') {
    if (variant === 'light') {
        return [name, tokens.colorInk];
    }
    return [name, tokens.colorWhite];
}
export function setBorderColor(name, variant = 'dark') {
    if (variant === 'light') {
        return [name, tokens.colorInkLighter];
    }
    return [name, tokens.colorSkyDark];
}
export function setTheme(color, baseName, key, variant) {
    const colorPairs = [];
    switch (variant) {
        case 'light':
            colorPairs.push(setTextColor(constructColorName(baseName, null, 'color'), 'light'));
            colorPairs.push(setBorderColor(constructColorName(baseName, null, 'border'), 'light'));
            colorPairs.push([
                constructColorName(baseName, key, 'lighter'),
                lightenToString(color, 7, -10),
            ]);
            break;
        case 'dark':
            colorPairs.push(setTextColor(constructColorName(baseName, null, 'color'), 'dark'));
            colorPairs.push(setBorderColor(constructColorName(baseName, null, 'border'), 'dark'));
            colorPairs.push([
                constructColorName(baseName, key, 'lighter'),
                lightenToString(color, 15, 15),
            ]);
            break;
        default:
    }
    return colorPairs;
}
function parseColors([baseName, colors]) {
    const keys = Object.keys(colors);
    const colorPairs = [];
    for (const key of keys) {
        colorPairs.push([constructColorName(baseName, key), colors[key]]);
        if (needsVariant(baseName)) {
            const hslColor = colorToHsla(colors[key]);
            if (typeof hslColor === 'string') {
                return colorPairs;
            }
            const rgbColor = hslToRgb(hslColor);
            if (isLight(rgbColor)) {
                colorPairs.push(...setTheme(hslColor, baseName, key, 'light'));
            }
            else {
                colorPairs.push(...setTheme(hslColor, baseName, key, 'dark'));
            }
        }
    }
    return colorPairs;
}
