import React from 'react';
import { FocusManager } from '../FocusManager';
import { merge } from '../../utilities/merge';
import { FrameContext } from '../../utilities/frame';
import { ThemeContext, buildThemeContext, buildCustomProperties, } from '../../utilities/theme';
import { MediaQueryContext } from '../../utilities/media-query';
import { ScrollLockManager, ScrollLockManagerContext, } from '../../utilities/scroll-lock-manager';
import { StickyManager, StickyManagerContext, } from '../../utilities/sticky-manager';
import { AppBridgeContext } from '../../utilities/app-bridge';
import { I18n, I18nContext } from '../../utilities/i18n';
import { LinkContext } from '../../utilities/link';
import { FeaturesContext } from '../../utilities/features';
import { UniqueIdFactory, UniqueIdFactoryContext, globalIdGeneratorFactory, } from '../../utilities/unique-id';
const defaultMediaQuery = {
    isNavigationCollapsed: false,
};
export function PolarisTestProvider({ strict, children, i18n, appBridge, link, theme = {}, mediaQuery, features: featuresProp = {}, frame, }) {
    const Wrapper = strict ? React.StrictMode : React.Fragment;
    const intl = new I18n(i18n || {});
    const scrollLockManager = new ScrollLockManager();
    const stickyManager = new StickyManager();
    const uniqueIdFactory = new UniqueIdFactory(globalIdGeneratorFactory);
    // This typing is odd, but as appBridge is deprecated and going away in v5
    // I'm not that worried about it
    const appBridgeApp = appBridge;
    const features = Object.assign({ newDesignLanguage: false }, featuresProp);
    const customProperties = features.newDesignLanguage
        ? buildCustomProperties(Object.assign(Object.assign({}, theme), { colorScheme: 'light' }), features.newDesignLanguage)
        : undefined;
    const mergedTheme = buildThemeContext(theme, customProperties);
    const mergedFrame = createFrameContext(frame);
    const mergedMediaQuery = merge(defaultMediaQuery, mediaQuery);
    return (<Wrapper>
      <FeaturesContext.Provider value={features}>
        <I18nContext.Provider value={intl}>
          <ScrollLockManagerContext.Provider value={scrollLockManager}>
            <StickyManagerContext.Provider value={stickyManager}>
              <UniqueIdFactoryContext.Provider value={uniqueIdFactory}>
                <AppBridgeContext.Provider value={appBridgeApp}>
                  <LinkContext.Provider value={link}>
                    <ThemeContext.Provider value={mergedTheme}>
                      <MediaQueryContext.Provider value={mergedMediaQuery}>
                        <FocusManager>
                          <FrameContext.Provider value={mergedFrame}>
                            {children}
                          </FrameContext.Provider>
                        </FocusManager>
                      </MediaQueryContext.Provider>
                    </ThemeContext.Provider>
                  </LinkContext.Provider>
                </AppBridgeContext.Provider>
              </UniqueIdFactoryContext.Provider>
            </StickyManagerContext.Provider>
          </ScrollLockManagerContext.Provider>
        </I18nContext.Provider>
      </FeaturesContext.Provider>
    </Wrapper>);
}
function noop() { }
function createFrameContext({ showToast = noop, hideToast = noop, setContextualSaveBar = noop, removeContextualSaveBar = noop, startLoading = noop, stopLoading = noop, } = {}) {
    return {
        showToast,
        hideToast,
        setContextualSaveBar,
        removeContextualSaveBar,
        startLoading,
        stopLoading,
    };
}
