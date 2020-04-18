import React from 'react';
import { createUniqueIDFactory } from '@shopify/javascript-utilities/other';
import styles from './DescriptionList.scss';
const getUniqueTermKey = createUniqueIDFactory(`Term`);
const getUniqueDescriptionKey = createUniqueIDFactory(`Description`);
export function DescriptionList({ items }) {
    const terms = items.reduce((allTerms, { term, description }) => [
        ...allTerms,
        <dt key={getUniqueTermKey()} className={styles.Term}>
        {term}
      </dt>,
        <dd key={getUniqueDescriptionKey()} className={styles.Description}>
        {description}
      </dd>,
    ], []);
    return <dl className={styles.DescriptionList}>{terms}</dl>;
}
