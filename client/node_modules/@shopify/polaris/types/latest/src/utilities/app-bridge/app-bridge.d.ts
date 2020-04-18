import { DispatchActionHook } from '@shopify/app-bridge';
export interface AppBridgeOptions {
    /** The API key for your application from the Partner dashboard */
    apiKey?: string;
    /**
     * The current shop’s origin, provided in the session from the Shopify API (to be provided without the https://)
     * @default getShopOrigin()
     * @see {@link https://help.shopify.com/en/api/embedded-apps/app-bridge#set-up-your-app|Shopify App Bridge docs}
     **/
    shopOrigin?: string;
    /** Forces a redirect to the relative admin path when not rendered in an iframe */
    forceRedirect?: boolean;
}
export declare function createAppBridge({ apiKey, shopOrigin, forceRedirect, }: AppBridgeOptions): import("@shopify/app-bridge").ClientApplication<{}> | undefined;
export declare const setClientInterfaceHook: DispatchActionHook;
