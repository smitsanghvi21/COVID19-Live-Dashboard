import { __rest } from "tslib";
import React, { useMemo, useEffect, useContext } from 'react';
import DefaultThemeColors from '@shopify/polaris-tokens/dist-modern/theme/base.json';
import { ThemeContext, buildThemeContext, buildCustomProperties, Tokens, } from '../../utilities/theme';
import { useFeatures } from '../../utilities/features';
export function ThemeProvider({ theme: themeConfig, children, }) {
    const { newDesignLanguage } = useFeatures();
    const parentContext = useContext(ThemeContext);
    const isParentThemeProvider = parentContext === undefined;
    const parentColorScheme = parentContext && parentContext.colorScheme && parentContext.colorScheme;
    const parentColors = parentContext && parentContext.colors && parentContext.colors;
    const { colors, colorScheme } = themeConfig, rest = __rest(themeConfig, ["colors", "colorScheme"]);
    const processedThemeConfig = Object.assign(Object.assign(Object.assign({}, rest), { colorScheme: getColorScheme(colorScheme, parentColorScheme) }), { colors: Object.assign(Object.assign(Object.assign({}, (isParentThemeProvider && DefaultThemeColors)), (parentColors != null && parentColors)), colors) });
    const customProperties = useMemo(() => buildCustomProperties(processedThemeConfig, newDesignLanguage, Tokens), [processedThemeConfig, newDesignLanguage]);
    const theme = useMemo(() => buildThemeContext(processedThemeConfig, newDesignLanguage ? customProperties : undefined), [customProperties, processedThemeConfig, newDesignLanguage]);
    // We want these values to be empty string instead of `undefined` when not set.
    // Otherwise, setting a style property to `undefined` does not remove it from the DOM.
    const backgroundColor = customProperties['--p-background'] || '';
    const color = customProperties['--p-text'] || '';
    useEffect(() => {
        if (isParentThemeProvider) {
            document.body.style.backgroundColor = backgroundColor;
            document.body.style.color = color;
        }
    }, [backgroundColor, color, isParentThemeProvider]);
    const style = Object.assign(Object.assign({}, customProperties), (!isParentThemeProvider && { color }));
    return (<ThemeContext.Provider value={Object.assign(Object.assign({}, theme), { textColor: color })}>
      <div style={style}>{children}</div>
    </ThemeContext.Provider>);
}
function isInverseColorScheme(colorScheme) {
    return colorScheme === 'inverse';
}
function getColorScheme(colorScheme, parentColorScheme) {
    if (colorScheme == null) {
        return parentColorScheme || 'light';
    }
    else if (isInverseColorScheme(colorScheme)) {
        return parentColorScheme === 'dark' || parentColorScheme === undefined
            ? 'light'
            : 'dark';
    }
    else {
        return colorScheme;
    }
}
