import { __rest } from "tslib";
import React from 'react';
import { ResourcePicker as AppBridgeResourcePicker } from '@shopify/app-bridge/actions';
import isEqual from 'lodash/isEqual';
import { withAppProvider, } from '../../utilities/with-app-provider';
/** @deprecated Use `ResourcePicker` from `@shopify/app-bridge-react` instead. */
class ResourcePickerInner extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.focusReturnPoint = null;
    }
    componentDidMount() {
        // eslint-disable-next-line no-console
        console.warn('Deprecation: `ResourcePicker` is deprecated and will be removed in v5.0. Use `ResourcePicker` from `@shopify/app-bridge-react` instead: https://help.shopify.com/en/api/embedded-apps/app-bridge/react-components/resourcepicker');
        if (this.props.polaris.appBridge == null) {
            return;
        }
        const { open, resourceType, initialQuery, showHidden = true, allowMultiple = true, showVariants = true, onSelection, onCancel, } = this.props;
        const { appBridge } = this.props.polaris;
        this.appBridgeResourcePicker = AppBridgeResourcePicker.create(appBridge, {
            resourceType: AppBridgeResourcePicker.ResourceType[resourceType],
            options: {
                initialQuery,
                showHidden,
                selectMultiple: allowMultiple,
                showVariants,
            },
        });
        if (onSelection != null) {
            this.appBridgeResourcePicker.subscribe(AppBridgeResourcePicker.Action.SELECT, ({ selection }) => {
                onSelection({ selection });
            });
        }
        if (onCancel != null) {
            this.appBridgeResourcePicker.subscribe(AppBridgeResourcePicker.Action.CANCEL, onCancel);
        }
        if (open) {
            this.focusReturnPoint = document.activeElement;
            this.appBridgeResourcePicker.dispatch(AppBridgeResourcePicker.Action.OPEN);
        }
    }
    componentDidUpdate(prevProps) {
        if (this.appBridgeResourcePicker == null) {
            return;
        }
        const { open, initialQuery, showHidden = false, allowMultiple = true, showVariants = true, onSelection, onCancel, } = this.props;
        const wasOpen = prevProps.open;
        const { polaris: { appBridge: prevAppBridge } } = prevProps, prevResourcePickerProps = __rest(prevProps, ["polaris"]);
        const _a = this.props, { polaris: { appBridge } } = _a, resourcePickerProps = __rest(_a, ["polaris"]);
        if (!isEqual(prevResourcePickerProps, resourcePickerProps) ||
            !isEqual(prevAppBridge, appBridge)) {
            this.appBridgeResourcePicker.set({
                initialQuery,
                showHidden,
                selectMultiple: allowMultiple,
                showVariants,
            });
        }
        this.appBridgeResourcePicker.unsubscribe();
        if (onSelection != null) {
            this.appBridgeResourcePicker.subscribe(AppBridgeResourcePicker.Action.SELECT, ({ selection }) => {
                onSelection({ selection });
            });
        }
        if (onCancel != null) {
            this.appBridgeResourcePicker.subscribe(AppBridgeResourcePicker.Action.CANCEL, onCancel);
        }
        if (wasOpen !== open) {
            if (open) {
                this.appBridgeResourcePicker.dispatch(AppBridgeResourcePicker.Action.OPEN);
            }
            else {
                this.appBridgeResourcePicker.dispatch(AppBridgeResourcePicker.Action.CLOSE);
            }
        }
        if (!wasOpen && open) {
            this.focusReturnPoint = document.activeElement;
        }
        else if (wasOpen &&
            !open &&
            this.focusReturnPoint instanceof HTMLElement &&
            document.contains(this.focusReturnPoint)) {
            this.focusReturnPoint.focus();
            this.focusReturnPoint = null;
        }
    }
    componentWillUnmount() {
        if (this.appBridgeResourcePicker == null) {
            return;
        }
        this.appBridgeResourcePicker.unsubscribe();
    }
    render() {
        return null;
    }
}
export const ResourcePicker = withAppProvider()(ResourcePickerInner);
