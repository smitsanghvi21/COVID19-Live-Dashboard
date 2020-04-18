import React from 'react';
import { ExternalSmallMinor } from '@shopify/polaris-icons';
import { useFeatures } from '../../utilities/features';
import { BannerContext } from '../../utilities/banner-context';
import { classNames } from '../../utilities/css';
import { useI18n } from '../../utilities/i18n';
import { UnstyledLink } from '../UnstyledLink';
import { Icon } from '../Icon';
import styles from './Link.scss';
export function Link({ url, children, onClick, external, id, monochrome, }) {
    const i18n = useI18n();
    let childrenMarkup = children;
    const { newDesignLanguage } = useFeatures();
    if (external && typeof children === 'string') {
        const iconLabel = i18n.translate('Polaris.Common.newWindowAccessibilityHint');
        childrenMarkup = (<React.Fragment>
        {children}
        <span className={styles.IconLockup}>
          <span className={styles.IconLayout}>
            <Icon accessibilityLabel={iconLabel} source={ExternalSmallMinor}/>
          </span>
        </span>
      </React.Fragment>);
    }
    return (<BannerContext.Consumer>
      {(BannerContext) => {
        const shouldBeMonochrome = monochrome || BannerContext;
        const className = classNames(styles.Link, shouldBeMonochrome && styles.monochrome, newDesignLanguage && styles.newDesignLanguage);
        return url ? (<UnstyledLink onClick={onClick} className={className} url={url} external={external} id={id}>
            {childrenMarkup}
          </UnstyledLink>) : (<button type="button" onClick={onClick} className={className} id={id}>
            {childrenMarkup}
          </button>);
    }}
    </BannerContext.Consumer>);
}
