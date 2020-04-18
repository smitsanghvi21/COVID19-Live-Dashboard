import React from 'react';
// eslint-disable-next-line shopify/strict-component-boundaries
import { ComboBoxContext } from '../ComboBox/context';
import { TextField as BaseTextField } from '../../../TextField';
export function TextField(props) {
    return (<ComboBoxContext.Consumer>
      {({ selectedOptionId, comboBoxId }) => (<BaseTextField {...props} autoComplete={false} ariaAutocomplete="list" ariaActiveDescendant={selectedOptionId} ariaControls={comboBoxId}/>)}
    </ComboBoxContext.Consumer>);
}
