import React from 'react';
import { SettingAction } from '../SettingAction';
import { buttonFrom } from '../Button';
import { Card } from '../Card';
export function SettingToggle({ enabled, action, children }) {
    const actionMarkup = action ? buttonFrom(action, { primary: !enabled }) : null;
    return (<Card sectioned>
      <SettingAction action={actionMarkup}>{children}</SettingAction>
    </Card>);
}
