import { useEffect } from 'react';
import { useScrollLockManager } from '../../utilities/scroll-lock-manager';
import './ScrollLock.scss';
// Even though this has no args, reference ScrollLockProps so the prop explorer
// in the styleguide works without warnings about unfound props
export function ScrollLock(_) {
    const scrollLockManager = useScrollLockManager();
    useEffect(() => {
        scrollLockManager.registerScrollLock();
        return () => {
            scrollLockManager.unregisterScrollLock();
        };
    }, [scrollLockManager]);
    return null;
}
