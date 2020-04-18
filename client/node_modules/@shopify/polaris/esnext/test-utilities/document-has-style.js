export function documentHasStyle(key, value) {
    if (!document) {
        return false;
    }
    const documentElement = document.querySelector('html');
    if (arguments.length === 1) {
        return (documentElement != null && Boolean(documentElement.style[key]));
    }
    return documentElement != null && documentElement.style[key] === value;
}
