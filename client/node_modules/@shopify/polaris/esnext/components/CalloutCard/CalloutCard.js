import React from 'react';
import { CancelSmallMinor } from '@shopify/polaris-icons';
import { classNames } from '../../utilities/css';
import { Card } from '../Card';
import { TextContainer } from '../TextContainer';
import { ButtonGroup } from '../ButtonGroup';
import { Button, buttonFrom } from '../Button';
import { Heading } from '../Heading';
import { Image } from '../Image';
import styles from './CalloutCard.scss';
export function CalloutCard({ title, children, illustration, primaryAction, secondaryAction, onDismiss, }) {
    const primaryActionMarkup = buttonFrom(primaryAction);
    const secondaryActionMarkup = secondaryAction
        ? buttonFrom(secondaryAction, { plain: true })
        : null;
    const buttonMarkup = secondaryActionMarkup ? (<ButtonGroup>
      {primaryActionMarkup}
      {secondaryActionMarkup}
    </ButtonGroup>) : (primaryActionMarkup);
    const dismissButton = onDismiss ? (<div className={styles.Dismiss}>
      <Button plain icon={CancelSmallMinor} onClick={onDismiss} accessibilityLabel="Dismiss card"/>
    </div>) : null;
    const imageClassName = classNames(styles.Image, onDismiss && styles.DismissImage);
    return (<Card>
      <div className={styles.Container}>
        {dismissButton}
        <Card.Section>
          <div className={styles.CalloutCard}>
            <div className={styles.Content}>
              <div className={styles.Title}>
                <Heading>{title}</Heading>
              </div>
              <TextContainer>{children}</TextContainer>
              <div className={styles.Buttons}>{buttonMarkup}</div>
            </div>

            <Image alt="" className={imageClassName} source={illustration}/>
          </div>
        </Card.Section>
      </div>
    </Card>);
}
