import React from 'react';
import hoistStatics from 'hoist-non-react-statics';
import { useI18n } from './i18n';
import { useStickyManager } from './sticky-manager';
import { useAppBridge } from './app-bridge';
import { useMediaQuery } from './media-query';
export function withAppProvider() {
    return function addProvider(WrappedComponent) {
        const WithAppProvider = (props) => {
            const polaris = {
                intl: useI18n(),
                stickyManager: useStickyManager(),
                appBridge: useAppBridge(),
                mediaQuery: useMediaQuery(),
            };
            return <WrappedComponent {...props} polaris={polaris}/>;
        };
        WithAppProvider.displayName = `WithAppProvider(${getDisplayName(WrappedComponent)})`;
        const FinalComponent = hoistStatics(WithAppProvider, WrappedComponent);
        return FinalComponent;
    };
}
function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}
