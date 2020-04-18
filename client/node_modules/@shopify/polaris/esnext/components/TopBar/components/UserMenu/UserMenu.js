import React from 'react';
import { Avatar } from '../../../Avatar';
import { MessageIndicator } from '../../../MessageIndicator';
import { Menu } from '../Menu';
import styles from './UserMenu.scss';
export function UserMenu({ name, detail, avatar, initials, actions, message, onToggle, open, }) {
    const showIndicator = Boolean(message);
    const activatorContentMarkup = (<React.Fragment>
      <MessageIndicator active={showIndicator}>
        <Avatar size="small" source={avatar} initials={initials && initials.replace(' ', '')}/>
      </MessageIndicator>
      <span className={styles.Details}>
        <p className={styles.Name}>{name}</p>
        <p className={styles.Detail}>{detail}</p>
      </span>
    </React.Fragment>);
    return (<Menu activatorContent={activatorContentMarkup} open={open} onOpen={onToggle} onClose={onToggle} actions={actions} message={message}/>);
}
