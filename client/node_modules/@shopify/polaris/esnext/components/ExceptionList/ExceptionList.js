import React from 'react';
import { classNames, variationName } from '../../utilities/css';
import { Icon } from '../Icon';
import { Truncate } from '../Truncate';
import styles from './ExceptionList.scss';
export function ExceptionList({ items: itemsList }) {
    const items = itemsList.map((item, index) => {
        const { status, icon, title, description, truncate = false } = item;
        const itemClasses = classNames(styles.Item, status && styles[variationName('status', status)]);
        const iconMarkup = icon ? (<Icon source={icon}/>) : (<span className={styles.Bullet}/>);
        const titleMarkup = title && <span className={styles.Title}>{title}</span>;
        const descriptionMarkup = description && (<span className={styles.Description}>{description}</span>);
        const Element = truncate ? Truncate : React.Fragment;
        return (<li className={itemClasses} key={index}>
        <span className={styles.Icon}>{iconMarkup}</span>
        <Element>
          {titleMarkup}
          {descriptionMarkup}
        </Element>
      </li>);
    });
    return <ul className={styles.ExceptionList}>{items}</ul>;
}
