import React from 'react';
import { CancelSmallMinor, CircleTickMajorTwotone, FlagMajorTwotone, CircleAlertMajorTwotone, CircleDisabledMajorTwotone, CircleInformationMajorTwotone, CircleInformationMajorFilled, CircleTickMajorFilled, CircleAlertMajorFilled, CircleDisabledMajorFilled, } from '@shopify/polaris-icons';
import { FeaturesContext } from '../../utilities/features';
import { BannerContext } from '../../utilities/banner-context';
import { classNames, variationName } from '../../utilities/css';
import { Button, buttonFrom } from '../Button';
import { Heading } from '../Heading';
import { ButtonGroup } from '../ButtonGroup';
import { UnstyledLink } from '../UnstyledLink';
import { Icon } from '../Icon';
import { WithinContentContext } from '../../utilities/within-content-context';
import styles from './Banner.scss';
export class Banner extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.state = {
            showFocus: false,
        };
        this.wrapper = React.createRef();
    }
    focus() {
        this.wrapper.current && this.wrapper.current.focus();
        this.setState({ showFocus: true });
    }
    render() {
        const { newDesignLanguage } = this.context || {};
        const { showFocus } = this.state;
        const handleKeyUp = (evt) => {
            if (evt.target === this.wrapper.current) {
                this.setState({ showFocus: true });
            }
        };
        const handleBlur = () => {
            this.setState({ showFocus: false });
        };
        const handleMouseUp = ({ currentTarget, }) => {
            const { showFocus } = this.state;
            currentTarget.blur();
            showFocus && this.setState({ showFocus: false });
        };
        return (<BannerContext.Provider value>
        <WithinContentContext.Consumer>
          {(withinContentContainer) => {
            const { icon, action, secondaryAction, title, children, status, onDismiss, stopAnnouncements, } = this.props;
            let color;
            let defaultIcon;
            let ariaRoleType = 'status';
            switch (status) {
                case 'success':
                    color = newDesignLanguage ? 'success' : 'greenDark';
                    defaultIcon = newDesignLanguage
                        ? CircleTickMajorFilled
                        : CircleTickMajorTwotone;
                    break;
                case 'info':
                    color = newDesignLanguage ? 'highlight' : 'tealDark';
                    defaultIcon = newDesignLanguage
                        ? CircleInformationMajorFilled
                        : CircleInformationMajorTwotone;
                    break;
                case 'warning':
                    color = newDesignLanguage ? 'warning' : 'yellowDark';
                    defaultIcon = newDesignLanguage
                        ? CircleAlertMajorFilled
                        : CircleAlertMajorTwotone;
                    ariaRoleType = 'alert';
                    break;
                case 'critical':
                    color = newDesignLanguage ? 'critical' : 'redDark';
                    defaultIcon = newDesignLanguage
                        ? CircleDisabledMajorFilled
                        : CircleDisabledMajorTwotone;
                    ariaRoleType = 'alert';
                    break;
                default:
                    color = newDesignLanguage ? 'base' : 'inkLighter';
                    defaultIcon = newDesignLanguage
                        ? CircleInformationMajorFilled
                        : FlagMajorTwotone;
            }
            const className = classNames(styles.Banner, status && styles[variationName('status', status)], onDismiss && styles.hasDismiss, showFocus && styles.keyFocused, withinContentContainer
                ? styles.withinContentContainer
                : styles.withinPage, newDesignLanguage && styles.newDesignLanguage);
            const id = uniqueID();
            const iconName = icon || defaultIcon;
            let headingMarkup = null;
            let headingID;
            if (title) {
                headingID = `${id}Heading`;
                headingMarkup = (<div className={styles.Heading} id={headingID}>
                  <Heading element="p">{title}</Heading>
                </div>);
            }
            const buttonSizeValue = withinContentContainer ? 'slim' : undefined;
            const secondaryActionMarkup = secondaryAction
                ? secondaryActionFrom(secondaryAction)
                : null;
            const actionMarkup = action ? (<div className={styles.Actions}>
                <ButtonGroup>
                  <div className={styles.PrimaryAction}>
                    {buttonFrom(action, { outline: true, size: buttonSizeValue })}
                  </div>
                  {secondaryActionMarkup}
                </ButtonGroup>
              </div>) : null;
            let contentMarkup = null;
            let contentID;
            if (children || actionMarkup) {
                contentID = `${id}Content`;
                contentMarkup = (<div className={styles.Content} id={contentID}>
                  {children}
                  {actionMarkup}
                </div>);
            }
            const dismissButton = onDismiss ? (<div className={styles.Dismiss}>
                <Button plain icon={CancelSmallMinor} onClick={onDismiss} accessibilityLabel="Dismiss notification"/>
              </div>) : null;
            return (<div className={className} 
            // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
            tabIndex={0} ref={this.wrapper} role={ariaRoleType} aria-live={stopAnnouncements ? 'off' : 'polite'} onMouseUp={handleMouseUp} onKeyUp={handleKeyUp} onBlur={handleBlur} aria-labelledby={headingID} aria-describedby={contentID}>
                {dismissButton}
                <div className={styles.Ribbon}>
                  <Icon source={iconName} color={color} backdrop={!newDesignLanguage}/>
                </div>
                <div className={styles.ContentWrapper}>
                  {headingMarkup}
                  {contentMarkup}
                </div>
              </div>);
        }}
        </WithinContentContext.Consumer>
      </BannerContext.Provider>);
    }
}
Banner.contextType = FeaturesContext;
let index = 1;
function uniqueID() {
    return `Banner${index++}`;
}
function secondaryActionFrom(action) {
    if (action.url) {
        return (<UnstyledLink className={styles.SecondaryAction} url={action.url} external={action.external}>
        <span className={styles.Text}>{action.content}</span>
      </UnstyledLink>);
    }
    return (<button className={styles.SecondaryAction} onClick={action.onAction}>
      <span className={styles.Text}>{action.content}</span>
    </button>);
}
