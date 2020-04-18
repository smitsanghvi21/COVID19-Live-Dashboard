import React from 'react';
import { Badge } from '../../../../../Badge';
import { Button } from '../../../../../Button';
import { Heading } from '../../../../../Heading';
import { Link } from '../../../../../Link';
import { Popover } from '../../../../../Popover';
import { Stack } from '../../../../../Stack';
import { TextContainer } from '../../../../../TextContainer';
import styles from './Message.scss';
export function Message({ title, description, action, link, badge, }) {
    const badgeMarkup = badge && (<Badge status={badge.status}>{badge.content}</Badge>);
    const { to, content: linkContent } = link;
    const { onClick, content: actionContent } = action;
    return (<div className={styles.Section}>
      <Popover.Section>
        <Stack vertical spacing="tight">
          <TextContainer>
            <Heading>
              {title}
              {badgeMarkup}
            </Heading>
            <p>{description}</p>
          </TextContainer>

          <Link url={to}>{linkContent}</Link>

          <Button plain onClick={onClick}>
            {actionContent}
          </Button>
        </Stack>
      </Popover.Section>
    </div>);
}
