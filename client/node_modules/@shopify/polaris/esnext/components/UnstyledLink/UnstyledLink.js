import { __rest } from "tslib";
import React from 'react';
import { unstyled } from '../shared';
import { useLink } from '../../utilities/link';
// Wrapping forwardRef in a memo gets a name set since
// https://github.com/facebook/react/issues/16722
// but eslint-plugin-react doesn't know that just yet
// eslint-disable-next-line react/display-name
export const UnstyledLink = React.memo(React.forwardRef(function UnstyledLink(props, _ref) {
    const LinkComponent = useLink();
    if (LinkComponent) {
        return <LinkComponent {...unstyled.props} {...props}/>;
    }
    const { external, url } = props, rest = __rest(props, ["external", "url"]);
    const target = external ? '_blank' : undefined;
    const rel = external ? 'noopener noreferrer' : undefined;
    return (<a target={target} {...rest} href={url} rel={rel} {...unstyled.props}/>);
}));
