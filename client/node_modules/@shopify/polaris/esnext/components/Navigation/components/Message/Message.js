import React from 'react';
import { Badge } from '../../../Badge';
import { Button } from '../../../Button';
import { Heading } from '../../../Heading';
import { Link } from '../../../Link';
import { Stack } from '../../../Stack';
import { TextContainer } from '../../../TextContainer';
import styles from './Message.scss';
export function Message({ title, description, action, link, badge, }) {
    const badgeMarkup = badge && (<Badge status={badge.status}>{badge.content}</Badge>);
    return (<div className={styles.Message}>
      <Stack vertical>
        <TextContainer>
          <Heading>
            {title}
            {badgeMarkup}
          </Heading>
          <p>{description}</p>
        </TextContainer>

        <Link url={link.to}>{link.content}</Link>

        <Button onClick={action.onClick} plain>
          {action.content}
        </Button>
      </Stack>
    </div>);
}
