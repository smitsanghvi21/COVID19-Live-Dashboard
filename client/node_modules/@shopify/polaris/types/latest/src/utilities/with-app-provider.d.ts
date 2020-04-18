import React from 'react';
import hoistStatics from 'hoist-non-react-statics';
import { useI18n } from './i18n';
import { useStickyManager } from './sticky-manager';
import { useAppBridge } from './app-bridge';
import { useMediaQuery } from './media-query';
export interface WithAppProviderProps {
    polaris: {
        intl: ReturnType<typeof useI18n>;
        stickyManager: ReturnType<typeof useStickyManager>;
        appBridge: ReturnType<typeof useAppBridge>;
        mediaQuery: ReturnType<typeof useMediaQuery>;
    };
}
export declare function withAppProvider<OwnProps>(): <C>(WrappedComponent: (React.ComponentClass<OwnProps & WithAppProviderProps, any> & C) | (React.FunctionComponent<OwnProps & WithAppProviderProps> & C)) => React.FunctionComponent<OwnProps> & hoistStatics.NonReactStatics<(React.ComponentClass<OwnProps & WithAppProviderProps, any> & C) | (React.FunctionComponent<OwnProps & WithAppProviderProps> & C), {}>;
