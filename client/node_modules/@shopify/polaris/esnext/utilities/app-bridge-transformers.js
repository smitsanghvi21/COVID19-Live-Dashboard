import { Redirect, Button, ButtonGroup } from '@shopify/app-bridge/actions';
export function generateRedirect(appBridge, url, target = 'APP', external) {
    if (url == null) {
        return undefined;
    }
    const redirect = Redirect.create(appBridge);
    const payload = external === true
        ? {
            url,
            newContext: true,
        }
        : url;
    return () => {
        redirect.dispatch(redirectAction(target, external), payload);
    };
}
function redirectAction(target, external) {
    if (external === true) {
        return Redirect.Action.REMOTE;
    }
    return Redirect.Action[target];
}
export function transformActions(appBridge, { primaryAction, secondaryActions, actionGroups, }) {
    const primary = transformPrimaryAction(appBridge, primaryAction);
    const secondary = [
        ...transformSecondaryActions(appBridge, secondaryActions),
        ...transformActionGroups(appBridge, actionGroups),
    ];
    return {
        primary,
        secondary,
    };
}
function transformAction(appBridge, action) {
    const style = action.destructive === true ? Button.Style.Danger : undefined;
    const button = Button.create(appBridge, {
        label: action.content || '',
        disabled: action.disabled,
        style,
    });
    if (action.onAction) {
        button.subscribe(Button.Action.CLICK, action.onAction);
    }
    const redirect = generateRedirect(appBridge, action.url, action.target, action.external);
    if (redirect != null) {
        button.subscribe(Button.Action.CLICK, redirect);
    }
    return button;
}
function transformPrimaryAction(appBridge, primaryAction) {
    if (primaryAction == null) {
        return undefined;
    }
    const primary = transformAction(appBridge, primaryAction);
    return primary;
}
function transformSecondaryActions(appBridge, secondaryActions = []) {
    const secondary = [
        ...secondaryActions.map((secondaryAction) => {
            return transformAction(appBridge, secondaryAction);
        }),
    ];
    return secondary;
}
function transformActionGroups(appBridge, actionGroups = []) {
    const buttonGroups = [
        ...actionGroups.map((group) => {
            const buttons = group.actions.map((groupAction) => {
                return transformAction(appBridge, groupAction);
            });
            return ButtonGroup.create(appBridge, { label: group.title, buttons });
        }),
    ];
    return buttonGroups;
}
