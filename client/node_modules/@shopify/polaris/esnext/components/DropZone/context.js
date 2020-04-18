import React from 'react';
export const DropZoneContext = React.createContext({
    disabled: false,
    focused: false,
    size: 'extraLarge',
    type: 'file',
    measuring: false,
});
