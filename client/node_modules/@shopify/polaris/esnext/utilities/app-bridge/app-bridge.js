import createApp, { getShopOrigin, LifecycleHook, } from '@shopify/app-bridge';
import { polarisVersion } from '../../configure';
export function createAppBridge({ apiKey, shopOrigin, forceRedirect, }) {
    const appBridge = apiKey
        ? createApp({
            apiKey,
            shopOrigin: shopOrigin || getShopOrigin(),
            forceRedirect,
        })
        : undefined;
    if (appBridge !== undefined) {
        // eslint-disable-next-line no-console
        console.warn('Deprecation: Using `apiKey` and `shopOrigin` on `AppProvider` to initialize the Shopify App Bridge is deprecated. Support for this will be removed in v5.0. Use `Provider` from `@shopify/app-bridge-react` instead: https://help.shopify.com/en/api/embedded-apps/app-bridge/react-components/provider');
    }
    if (appBridge && appBridge.hooks) {
        appBridge.hooks.set(LifecycleHook.DispatchAction, setClientInterfaceHook);
    }
    return appBridge;
}
export const setClientInterfaceHook = function (next) {
    return function (action) {
        action.clientInterface = {
            name: '@shopify/polaris',
            version: polarisVersion,
        };
        return next(action);
    };
};
