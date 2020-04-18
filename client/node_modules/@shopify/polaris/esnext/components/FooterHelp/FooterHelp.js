import React from 'react';
import { QuestionMarkMajorTwotone, InfoMinor } from '@shopify/polaris-icons';
import { useFeatures } from '../../utilities/features';
import { classNames } from '../../utilities/css';
import { Icon } from '../Icon';
import styles from './FooterHelp.scss';
export function FooterHelp({ children }) {
    const { newDesignLanguage } = useFeatures();
    const className = classNames(styles.FooterHelp, newDesignLanguage && styles.newDesignLanguage);
    const iconProps = {
        source: newDesignLanguage ? InfoMinor : QuestionMarkMajorTwotone,
        color: newDesignLanguage ? 'highlight' : 'teal',
        backdrop: !newDesignLanguage,
    };
    return (<div className={className}>
      <div className={styles.Content}>
        <div className={styles.Icon}>
          <Icon {...iconProps}/>
        </div>
        <div className={styles.Text}>{children}</div>
      </div>
    </div>);
}
