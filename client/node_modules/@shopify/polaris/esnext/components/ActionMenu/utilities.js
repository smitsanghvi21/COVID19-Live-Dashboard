export function sortAndOverrideActionOrder(actions) {
    const actionsWithOverrides = actions.filter((action) => action.index !== undefined);
    if (actionsWithOverrides.length === 0) {
        return actions;
    }
    const sortedActionsWithOverrides = actionsWithOverrides.sort(({ index: indexA }, { index: indexB }) => {
        return indexA - indexB;
    });
    const actionsWithoutOverrides = actions.filter((action) => action.index === undefined);
    const overriddenActions = [
        ...actionsWithoutOverrides,
    ];
    sortedActionsWithOverrides.forEach((action) => {
        overriddenActions.splice(action.index, 0, action);
    });
    return overriddenActions;
}
