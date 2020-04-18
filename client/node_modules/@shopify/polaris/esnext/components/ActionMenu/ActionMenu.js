import { __rest } from "tslib";
import React from 'react';
import { classNames } from '../../utilities/css';
import { FeaturesContext } from '../../utilities/features';
import { Button } from '../Button';
import { ButtonGroup } from '../ButtonGroup';
import { sortAndOverrideActionOrder } from './utilities';
import { MenuAction, MenuGroup, RollupActions } from './components';
import styles from './ActionMenu.scss';
export class ActionMenu extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.state = {
            activeMenuGroup: undefined,
        };
        this.renderActions = () => {
            const { newDesignLanguage } = this.context || {};
            const { actions = [], groups = [] } = this.props;
            const { activeMenuGroup } = this.state;
            const menuActions = [...actions, ...groups];
            const overriddenActions = sortAndOverrideActionOrder(menuActions);
            const actionMarkup = overriddenActions.map((action, index) => {
                if ('title' in action) {
                    const { title, actions } = action, rest = __rest(action, ["title", "actions"]);
                    return actions.length > 0 ? (<MenuGroup key={`MenuGroup-${index}`} title={title} active={title === activeMenuGroup} actions={actions} {...rest} onOpen={this.handleMenuGroupToggle} onClose={this.handleMenuGroupClose}/>) : null;
                }
                const { content } = action, rest = __rest(action, ["content"]);
                return newDesignLanguage ? (<Button key={index} {...rest}>
          {content}
        </Button>) : (<MenuAction key={`MenuAction-${index}`} content={content} {...rest}/>);
            });
            return (<div className={styles.ActionsLayout}>
        {newDesignLanguage ? (<ButtonGroup>{actionMarkup}</ButtonGroup>) : (actionMarkup)}
      </div>);
        };
        this.handleMenuGroupToggle = (group) => {
            this.setState(({ activeMenuGroup }) => ({
                activeMenuGroup: activeMenuGroup ? undefined : group,
            }));
        };
        this.handleMenuGroupClose = () => {
            this.setState({ activeMenuGroup: undefined });
        };
    }
    render() {
        const { actions = [], groups = [], rollup } = this.props;
        if (actions.length === 0 && groups.length === 0) {
            return null;
        }
        const actionMenuClassNames = classNames(styles.ActionMenu, rollup && styles.rollup);
        const rollupSections = groups.map((group) => convertGroupToSection(group));
        return (<div className={actionMenuClassNames}>
        {rollup ? (<RollupActions items={actions} sections={rollupSections}/>) : (this.renderActions())}
      </div>);
    }
}
ActionMenu.contextType = FeaturesContext;
export function hasGroupsWithActions(groups = []) {
    return groups.length === 0
        ? false
        : groups.some((group) => group.actions.length > 0);
}
function convertGroupToSection({ title, actions, }) {
    return { title, items: actions };
}
