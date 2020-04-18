import React, { useRef, useState, useCallback } from 'react';
import { CaretDownMinor } from '@shopify/polaris-icons';
import { classNames, variationName } from '../../utilities/css';
import { handleMouseUpByBlurring } from '../../utilities/focus';
import { useFeatures } from '../../utilities/features';
import { useI18n } from '../../utilities/i18n';
import { UnstyledLink } from '../UnstyledLink';
import { Icon } from '../Icon';
import { Spinner } from '../Spinner';
import { Popover } from '../Popover';
import { ActionList } from '../ActionList';
import styles from './Button.scss';
const DEFAULT_SIZE = 'medium';
export function Button({ id, url, disabled, loading, children, accessibilityLabel, ariaControls, ariaExpanded, ariaPressed, onClick, onFocus, onBlur, onKeyDown, onKeyPress, onKeyUp, onMouseEnter, onTouchStart, external, download, icon, primary, outline, destructive, disclosure, plain, monochrome, submit, size = DEFAULT_SIZE, textAlign, fullWidth, pressed, connectedDisclosure, }) {
    const { newDesignLanguage } = useFeatures();
    const hasGivenDeprecationWarning = useRef(false);
    if (ariaPressed && !hasGivenDeprecationWarning.current) {
        // eslint-disable-next-line no-console
        console.warn('Deprecation: The ariaPressed prop has been replaced with pressed');
        hasGivenDeprecationWarning.current = true;
    }
    const i18n = useI18n();
    const isDisabled = disabled || loading;
    const className = classNames(styles.Button, newDesignLanguage && styles.newDesignLanguage, primary && styles.primary, outline && styles.outline, destructive && styles.destructive, isDisabled && styles.disabled, loading && styles.loading, plain && styles.plain, pressed && !disabled && !url && styles.pressed, monochrome && styles.monochrome, size && size !== DEFAULT_SIZE && styles[variationName('size', size)], textAlign && styles[variationName('textAlign', textAlign)], fullWidth && styles.fullWidth, icon && children == null && styles.iconOnly, connectedDisclosure && styles.connectedDisclosure);
    const disclosureIcon = (<Icon source={loading ? 'placeholder' : CaretDownMinor}/>);
    const disclosureIconMarkup = disclosure ? (<span className={styles.Icon}>
      <div className={classNames(styles.DisclosureIcon, disclosure === 'up' && styles.DisclosureIconFacingUp)}>
        {disclosureIcon}
      </div>
    </span>) : null;
    let iconMarkup;
    if (icon) {
        const iconInner = isIconSource(icon) ? (<Icon source={loading ? 'placeholder' : icon}/>) : (icon);
        iconMarkup = <span className={styles.Icon}>{iconInner}</span>;
    }
    const childMarkup = children ? (<span className={styles.Text}>{children}</span>) : null;
    const spinnerColor = primary || destructive ? 'white' : 'inkLightest';
    const spinnerSVGMarkup = loading ? (<span className={styles.Spinner}>
      <Spinner size="small" color={spinnerColor} accessibilityLabel={i18n.translate('Polaris.Button.spinnerAccessibilityLabel')}/>
    </span>) : null;
    const content = iconMarkup || disclosureIconMarkup ? (<span className={styles.Content}>
        {spinnerSVGMarkup}
        {iconMarkup}
        {childMarkup}
        {disclosureIconMarkup}
      </span>) : (<span className={styles.Content}>
        {spinnerSVGMarkup}
        {childMarkup}
      </span>);
    const type = submit ? 'submit' : 'button';
    const ariaPressedStatus = pressed !== undefined ? pressed : ariaPressed;
    const [disclosureActive, setDisclosureActive] = useState(false);
    const toggleDisclosureActive = useCallback(() => {
        setDisclosureActive((disclosureActive) => !disclosureActive);
    }, []);
    let connectedDisclosureMarkup;
    if (connectedDisclosure) {
        const connectedDisclosureClassName = classNames(styles.Button, primary && styles.primary, outline && styles.outline, size && size !== DEFAULT_SIZE && styles[variationName('size', size)], textAlign && styles[variationName('textAlign', textAlign)], destructive && styles.destructive, connectedDisclosure.disabled && styles.disabled, styles.iconOnly, styles.ConnectedDisclosure, newDesignLanguage && styles.newDesignLanguage);
        const defaultLabel = i18n.translate('Polaris.Button.connectedDisclosureAccessibilityLabel');
        const { disabled, accessibilityLabel: disclosureLabel = defaultLabel, } = connectedDisclosure;
        const connectedDisclosureActivator = (<button type="button" className={connectedDisclosureClassName} disabled={disabled} aria-label={disclosureLabel} onClick={toggleDisclosureActive} onMouseUp={handleMouseUpByBlurring}>
        <span className={styles.Icon}>
          <Icon source={CaretDownMinor}/>
        </span>
      </button>);
        connectedDisclosureMarkup = (<Popover active={disclosureActive} onClose={toggleDisclosureActive} activator={connectedDisclosureActivator} preferredAlignment="right">
        <ActionList items={connectedDisclosure.actions} onActionAnyItem={toggleDisclosureActive}/>
      </Popover>);
    }
    let buttonMarkup;
    if (url) {
        buttonMarkup = isDisabled ? (
        // Render an `<a>` so toggling disabled/enabled state changes only the
        // `href` attribute instead of replacing the whole element.
        // eslint-disable-next-line jsx-a11y/anchor-is-valid
        <a id={id} className={className} aria-label={accessibilityLabel}>
        {content}
      </a>) : (<UnstyledLink id={id} url={url} external={external} download={download} onClick={onClick} onFocus={onFocus} onBlur={onBlur} onMouseUp={handleMouseUpByBlurring} onMouseEnter={onMouseEnter} onTouchStart={onTouchStart} className={className} aria-label={accessibilityLabel}>
        {content}
      </UnstyledLink>);
    }
    else {
        buttonMarkup = (<button id={id} type={type} onClick={onClick} onFocus={onFocus} onBlur={onBlur} onKeyDown={onKeyDown} onKeyUp={onKeyUp} onKeyPress={onKeyPress} onMouseUp={handleMouseUpByBlurring} onMouseEnter={onMouseEnter} onTouchStart={onTouchStart} className={className} disabled={isDisabled} aria-label={accessibilityLabel} aria-controls={ariaControls} aria-expanded={ariaExpanded} aria-pressed={ariaPressedStatus} role={loading ? 'alert' : undefined} aria-busy={loading ? true : undefined}>
        {content}
      </button>);
    }
    return connectedDisclosureMarkup ? (<div className={styles.ConnectedDisclosureWrapper}>
      {buttonMarkup}
      {connectedDisclosureMarkup}
    </div>) : (buttonMarkup);
}
function isIconSource(x) {
    return (typeof x === 'string' ||
        (typeof x === 'object' && x.body) ||
        typeof x === 'function');
}
