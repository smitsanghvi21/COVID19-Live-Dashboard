/// <reference types="hoist-non-react-statics" />
import React from 'react';
import { ResourcePicker as AppBridgeResourcePicker } from '@shopify/app-bridge/actions';
import { WithAppProviderProps } from '../../utilities/with-app-provider';
interface SelectPayload {
    /** The selected resources
     * @see {@link https://help.shopify.com/en/api/embedded-apps/app-bridge/actions/resourcepicker|resource picker documentation} for more information
     */
    selection: AppBridgeResourcePicker.ResourceSelection[];
}
export interface ResourcePickerProps {
    /** Whether the picker is open or not */
    open: boolean;
    /** The type of resource you want to pick */
    resourceType: 'Product' | 'ProductVariant' | 'Collection';
    /** GraphQL initial search query for filtering resources available in the picker
     * @see {@link https://help.shopify.com/en/api/getting-started/search-syntax|search syntax} for more information
     */
    initialQuery?: string;
    /** Whether to show hidden products or not
     * @default true
     */
    showHidden?: boolean;
    /** Whether to allow selection of multiple items
     * @default true
     */
    allowMultiple?: boolean;
    /** Whether to show product variants or not. Only applies to the product resource type picker
     * @default true
     */
    showVariants?: boolean;
    /** Callback when a selection has been made */
    onSelection?(selectPayload: SelectPayload): void;
    /** Callback when the picker is closed without selection */
    onCancel?(): void;
}
declare type CombinedProps = ResourcePickerProps & WithAppProviderProps;
/** @deprecated Use `ResourcePicker` from `@shopify/app-bridge-react` instead. */
declare class ResourcePickerInner extends React.PureComponent<CombinedProps, never> {
    private focusReturnPoint;
    private appBridgeResourcePicker;
    componentDidMount(): void;
    componentDidUpdate(prevProps: CombinedProps): void;
    componentWillUnmount(): void;
    render(): null;
}
export declare const ResourcePicker: React.FunctionComponent<ResourcePickerProps> & import("hoist-non-react-statics").NonReactStatics<(React.ComponentClass<CombinedProps, any> & typeof ResourcePickerInner) | (React.FunctionComponent<CombinedProps> & typeof ResourcePickerInner), {}>;
export {};
