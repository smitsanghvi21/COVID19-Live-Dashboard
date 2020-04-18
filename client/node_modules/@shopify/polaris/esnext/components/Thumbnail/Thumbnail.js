import React from 'react';
import { classNames, variationName } from '../../utilities/css';
import { Image } from '../Image';
import styles from './Thumbnail.scss';
export function Thumbnail({ source, alt, size = 'medium' }) {
    const className = classNames(styles.Thumbnail, size && styles[variationName('size', size)]);
    return (<span className={className}>
      <Image alt={alt} source={source} className={styles.Image}/>
    </span>);
}
