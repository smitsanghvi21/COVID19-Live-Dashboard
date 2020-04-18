import React, { useState, useCallback } from 'react';
import debounce from 'lodash/debounce';
import { MobileHamburgerMajorMonotone } from '@shopify/polaris-icons';
import { classNames } from '../../utilities/css';
import { getWidth } from '../../utilities/get-width';
import { useI18n } from '../../utilities/i18n';
import { useTheme } from '../../utilities/theme';
import { useFeatures } from '../../utilities/features';
import { useToggle } from '../../utilities/use-toggle';
import { EventListener } from '../EventListener';
import { Icon } from '../Icon';
import { Image } from '../Image';
import { UnstyledLink } from '../UnstyledLink';
import { SearchField, UserMenu, Search, Menu, } from './components';
import styles from './TopBar.scss';
// TypeScript can't generate types that correctly infer the typing of
// subcomponents so explicitly state the subcomponents in the type definition.
// Letting this be implicit works in this project but fails in projects that use
// generated *.d.ts files.
export const TopBar = function TopBar({ showNavigationToggle, userMenu, searchResults, searchField, secondaryMenu, searchResultsVisible, searchResultsOverlayVisible = false, onNavigationToggle, onSearchResultsDismiss, contextControl, }) {
    const i18n = useI18n();
    const { logo } = useTheme();
    const [scrolled, setScrolled] = useState(false);
    const { newDesignLanguage } = useFeatures();
    const { value: focused, setTrue: forceTrueFocused, setFalse: forceFalseFocused, } = useToggle(false);
    const handleScroll = useCallback(debounce(() => {
        const scrollDistance = window.scrollY;
        const isScrolled = scrollDistance >= 1;
        if (scrolled && isScrolled) {
            return;
        }
        window.requestAnimationFrame(() => setScrolled(Boolean(isScrolled)));
    }, 20), []);
    const iconClassName = classNames(styles.NavigationIcon, focused && styles.focused);
    const navigationButtonMarkup = showNavigationToggle ? (<button type="button" className={iconClassName} onClick={onNavigationToggle} onFocus={forceTrueFocused} onBlur={forceFalseFocused} aria-label={i18n.translate('Polaris.TopBar.toggleMenuLabel')}>
      <Icon source={MobileHamburgerMajorMonotone}/>
    </button>) : null;
    const width = getWidth(logo, 104);
    let contextMarkup;
    if (contextControl && !newDesignLanguage) {
        contextMarkup = (<div testID="ContextControl" className={styles.ContextControl}>
        {contextControl}
      </div>);
    }
    else if (logo && !newDesignLanguage) {
        contextMarkup = (<div className={styles.LogoContainer}>
        <UnstyledLink url={logo.url || ''} className={styles.LogoLink} style={{ width }}>
          <Image source={logo.topBarSource || ''} alt={logo.accessibilityLabel || ''} className={styles.Logo} style={{ width }}/>
        </UnstyledLink>
      </div>);
    }
    const searchMarkup = searchField ? (<React.Fragment>
      {searchField}
      <Search visible={searchResultsVisible} onDismiss={onSearchResultsDismiss} overlayVisible={searchResultsOverlayVisible}>
        {searchResults}
      </Search>
    </React.Fragment>) : null;
    const scrollListenerMarkup = newDesignLanguage ? (<EventListener event="scroll" handler={handleScroll} passive/>) : null;
    const className = classNames(styles.TopBar, newDesignLanguage && styles['TopBar-newDesignLanguage'], scrolled && styles.isScrolled);
    return (<div className={className}>
      {navigationButtonMarkup}
      {contextMarkup}
      <div className={styles.Contents}>
        <div className={styles.SearchField}>{searchMarkup}</div>
        <div className={styles.SecondaryMenu}>{secondaryMenu}</div>
        {userMenu}
      </div>
      {scrollListenerMarkup}
    </div>);
};
TopBar.Menu = Menu;
TopBar.SearchField = SearchField;
TopBar.UserMenu = UserMenu;
