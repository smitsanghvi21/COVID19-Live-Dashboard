import React from 'react';
import { classNames, variationName } from '../../utilities/css';
import styles from './TextStyle.scss';
var VariationValue;
(function (VariationValue) {
    VariationValue["Positive"] = "positive";
    VariationValue["Negative"] = "negative";
    VariationValue["Strong"] = "strong";
    VariationValue["Subdued"] = "subdued";
    VariationValue["Code"] = "code";
})(VariationValue || (VariationValue = {}));
export function TextStyle({ variation, children }) {
    const className = classNames(variation && styles[variationName('variation', variation)], variation === VariationValue.Code && styles.code);
    const Element = variationElement(variation);
    return <Element className={className}>{children}</Element>;
}
function variationElement(variation) {
    return variation === VariationValue.Code ? 'code' : 'span';
}
