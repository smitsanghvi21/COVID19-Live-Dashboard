import React from 'react';
import { ActionList } from '../../../ActionList';
import { Popover } from '../../../Popover';
import { Message } from './components';
import styles from './Menu.scss';
export function Menu(props) {
    const { actions, onOpen, onClose, open, activatorContent, message } = props;
    const badgeProps = message &&
        message.badge && {
        content: message.badge.content,
        status: message.badge.status,
    };
    const messageMarkup = message && (<Message title={message.title} description={message.description} action={{
        onClick: message.action.onClick,
        content: message.action.content,
    }} link={{ to: message.link.to, content: message.link.content }} badge={badgeProps}/>);
    const isFullHeight = Boolean(message);
    return (<Popover activator={<div className={styles.ActivatorWrapper}>
          <button type="button" className={styles.Activator} onClick={onOpen}>
            {activatorContent}
          </button>
        </div>} active={open} onClose={onClose} fixed fullHeight={isFullHeight} preferredAlignment="right">
      <ActionList onActionAnyItem={onClose} sections={actions}/>
      {messageMarkup}
    </Popover>);
}
