import * as React from 'react';
import { classNames } from '../../../../../../utilities/css';
import { DisplayText } from '../../../../../DisplayText';
import { useFeatures } from '../../../../../../utilities/features';
import styles from './Title.scss';
export function Title({ title, subtitle, titleMetadata, thumbnail }) {
    const { newDesignLanguage } = useFeatures();
    const titleMarkup = title ? (<div className={styles.Title}>
      <DisplayText size="large" element="h1">
        {title}
      </DisplayText>
    </div>) : null;
    const titleMetadataMarkup = titleMetadata ? (<div className={classNames(styles.TitleMetadata, newDesignLanguage && styles.newDesignLanguage)}>
      {titleMetadata}
    </div>) : null;
    const wrappedTitleMarkup = titleMetadata ? (<div className={styles.TitleWithMetadataWrapper}>
      {titleMarkup}
      {titleMetadataMarkup}
    </div>) : (titleMarkup);
    const subtitleMarkup = subtitle ? (<div className={styles.SubTitle}>
      <p>{subtitle}</p>
    </div>) : null;
    const thumbnailMarkup = thumbnail ? <div>{thumbnail}</div> : null;
    const pageTitleClassName = thumbnail
        ? classNames(styles.hasThumbnail)
        : undefined;
    return (<div className={pageTitleClassName}>
      {thumbnailMarkup}
      <div className={styles.TitleAndSubtitleWrapper}>
        {wrappedTitleMarkup}
        {subtitleMarkup}
      </div>
    </div>);
}
