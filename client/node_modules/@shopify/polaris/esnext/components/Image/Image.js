import { __rest } from "tslib";
import React from 'react';
export function Image(_a) {
    var { sourceSet, source, crossOrigin } = _a, rest = __rest(_a, ["sourceSet", "source", "crossOrigin"]);
    const finalSourceSet = sourceSet
        ? sourceSet
            .map(({ source: subSource, descriptor }) => `${subSource} ${descriptor}`)
            .join(',')
        : null;
    return finalSourceSet ? (
    // eslint-disable-next-line jsx-a11y/alt-text
    <img src={source} srcSet={finalSourceSet} crossOrigin={crossOrigin} {...rest}/>) : (
    // eslint-disable-next-line jsx-a11y/alt-text
    <img src={source} {...rest} crossOrigin={crossOrigin}/>);
}
