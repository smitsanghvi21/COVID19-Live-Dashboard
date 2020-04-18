import { mount, ReactWrapper } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { get } from '../utilities/get';
import translations from '../../locales/en.json';
import { PolarisTestProvider, } from '../components';
export { ReactWrapper, act };
export function findByTestID(root, id) {
    function hasTestID(wrapper) {
        return wrapper.length > 0 && wrapper.prop('testID') === id;
    }
    return root.findWhere(hasTestID).first();
}
const reactAct = act;
export function trigger(wrapper, keypath, ...args) {
    if (wrapper.length === 0) {
        throw new Error([
            `You tried to trigger ${keypath} on a React wrapper with no matching nodes.`,
            'This generally happens because you have either filtered your React components incorrectly,',
            'or the component you are looking for is not rendered because of the props on your component,',
            'or there is some error during one of your component’s render methods.',
        ].join(' '));
    }
    const props = wrapper.props();
    const callback = get(props, keypath);
    if (callback == null) {
        throw new Error(`No callback found at keypath '${keypath}'. Available props: ${Object.keys(props).join(', ')}`);
    }
    let returnValue;
    const promise = reactAct(() => {
        // eslint-disable-next-line callback-return, node/no-callback-literal
        returnValue = callback(...args);
        // The return type of non-async `act()`, DebugPromiseLike, contains a `then` method
        // This condition checks the returned value is an actual Promise and returns it
        // to React’s `act()` call, otherwise we just want to return `undefined`
        if (isPromise(returnValue)) {
            return returnValue;
        }
    });
    if (isPromise(returnValue)) {
        return Promise.resolve(promise).then((ret) => {
            updateRoot(wrapper);
            return ret;
        });
    }
    updateRoot(wrapper);
    return returnValue;
}
function isPromise(promise) {
    return (promise != null && typeof promise === 'object' && 'then' in promise);
}
function updateRoot(wrapper) {
    wrapper.root().update();
}
export function mountWithAppProvider(node, context = {}) {
    return mount(node, {
        wrappingComponent: PolarisTestProvider,
        wrappingComponentProps: Object.assign({ i18n: translations }, context),
    });
}
