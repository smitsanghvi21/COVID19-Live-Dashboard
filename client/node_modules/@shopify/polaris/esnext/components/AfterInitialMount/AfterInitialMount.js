import React from 'react';
import { useIsAfterInitialMount } from '../../utilities/use-is-after-initial-mount';
export function AfterInitialMount({ children, fallback = null }) {
    const isMounted = useIsAfterInitialMount();
    const content = isMounted ? children : fallback;
    return <React.Fragment>{content}</React.Fragment>;
}
