import React, { useMemo, useState, useCallback } from 'react';
import { FocusManagerContext } from '../../utilities/focus-manager';
export function FocusManager({ children }) {
    const [trapFocusList, setTrapFocusList] = useState([]);
    const add = useCallback((id) => {
        setTrapFocusList((list) => [...list, id]);
    }, []);
    const remove = useCallback((id) => {
        let removed = true;
        setTrapFocusList((list) => {
            const clone = [...list];
            const index = clone.indexOf(id);
            if (index === -1) {
                removed = false;
            }
            else {
                clone.splice(index, 1);
            }
            return clone;
        });
        return removed;
    }, []);
    const value = useMemo(() => ({ trapFocusList, add, remove }), [
        add,
        trapFocusList,
        remove,
    ]);
    return (<FocusManagerContext.Provider value={value}>
      {children}
    </FocusManagerContext.Provider>);
}
