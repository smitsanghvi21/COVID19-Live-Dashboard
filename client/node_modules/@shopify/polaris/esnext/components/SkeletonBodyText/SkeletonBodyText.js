import React from 'react';
import styles from './SkeletonBodyText.scss';
export function SkeletonBodyText({ lines = 3 }) {
    const bodyTextLines = [];
    for (let i = 0; i < lines; i++) {
        bodyTextLines.push(<div className={styles.SkeletonBodyText} key={i}/>);
    }
    return (<div className={styles.SkeletonBodyTextContainer}>{bodyTextLines}</div>);
}
