export function compose(...fns) {
    return fns.reduce((func, group) => (...args) => func(group(...args)));
}
