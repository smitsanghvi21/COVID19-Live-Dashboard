import { __rest } from "tslib";
import React from 'react';
import { Item } from '../Item';
import styles from '../../ActionList.scss';
export function Section({ section, hasMultipleSections, actionRole, onActionAnyItem, }) {
    const handleAction = (itemOnAction) => {
        return () => {
            if (itemOnAction) {
                itemOnAction();
            }
            if (onActionAnyItem) {
                onActionAnyItem();
            }
        };
    };
    const actionMarkup = section.items.map((_a, index) => {
        var { content, helpText, onAction } = _a, item = __rest(_a, ["content", "helpText", "onAction"]);
        return (<Item key={`${content}-${index}`} content={content} helpText={helpText} role={actionRole} onAction={handleAction(onAction)} {...item}/>);
    });
    const className = section.title ? undefined : styles['Section-withoutTitle'];
    const titleMarkup = section.title ? (<p className={styles.Title}>{section.title}</p>) : null;
    const sectionRole = actionRole === 'option' ? 'presentation' : undefined;
    const sectionMarkup = (<div className={className}>
      {titleMarkup}
      <ul className={styles.Actions} role={sectionRole}>
        {actionMarkup}
      </ul>
    </div>);
    return hasMultipleSections ? (<li className={styles.Section}>{sectionMarkup}</li>) : (sectionMarkup);
}
