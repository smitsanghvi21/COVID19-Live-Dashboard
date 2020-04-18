import React from 'react';
import { HorizontalDotsMinor } from '@shopify/polaris-icons';
import { classNames } from '../../utilities/css';
import { Icon } from '../Icon';
import { Popover } from '../Popover';
import { FeaturesContext } from '../../utilities/features';
import { withAppProvider, } from '../../utilities/with-app-provider';
import { getVisibleAndHiddenTabIndices } from './utilities';
import { List, Panel, Tab, TabMeasurer } from './components';
import styles from './Tabs.scss';
class TabsInner extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.state = {
            disclosureWidth: 0,
            containerWidth: Infinity,
            tabWidths: [],
            visibleTabs: [],
            hiddenTabs: [],
            showDisclosure: false,
            tabToFocus: -1,
        };
        this.handleKeyPress = (event) => {
            const { tabToFocus, visibleTabs, hiddenTabs, showDisclosure } = this.state;
            const key = event.key;
            const tabsArrayInOrder = showDisclosure
                ? visibleTabs.concat(hiddenTabs)
                : [...visibleTabs];
            let newFocus = tabsArrayInOrder.indexOf(tabToFocus);
            if (key === 'ArrowRight' || key === 'ArrowDown') {
                newFocus += 1;
                if (newFocus === tabsArrayInOrder.length) {
                    newFocus = 0;
                }
            }
            if (key === 'ArrowLeft' || key === 'ArrowUp') {
                if (newFocus === -1 || newFocus === 0) {
                    newFocus = tabsArrayInOrder.length - 1;
                }
                else {
                    newFocus -= 1;
                }
            }
            this.setState({
                tabToFocus: tabsArrayInOrder[newFocus],
            });
        };
        this.renderTabMarkup = (tab, index) => {
            const { selected } = this.props;
            const { tabToFocus } = this.state;
            return (<Tab key={`${index}-${tab.id}`} id={tab.id} siblingTabHasFocus={tabToFocus > -1} focused={index === tabToFocus} selected={index === selected} onClick={this.handleTabClick} panelID={tab.panelID || `${tab.id}-panel`} accessibilityLabel={tab.accessibilityLabel} url={tab.url}>
        {tab.content}
      </Tab>);
        };
        this.handleFocus = (event) => {
            const { selected, tabs } = this.props;
            // If we are explicitly focusing a non-selected tab, this focuses it
            const target = event.target;
            if (target.classList.contains(styles.Tab) ||
                target.classList.contains(styles.Item)) {
                let tabToFocus = -1;
                tabs.every((tab, index) => {
                    if (tab.id === target.id) {
                        tabToFocus = index;
                        return false;
                    }
                    return true;
                });
                this.setState({ tabToFocus });
                return;
            }
            if (target.classList.contains(styles.DisclosureActivator)) {
                return;
            }
            // If we are coming in from somewhere other than another tab, focus the
            // selected tab, and the focus (click) is not on the disclosure activator,
            // focus the selected tab
            if (!event.relatedTarget) {
                this.setState({ tabToFocus: selected });
                return;
            }
            const relatedTarget = event.relatedTarget;
            if (relatedTarget instanceof HTMLElement &&
                !relatedTarget.classList.contains(styles.Tab) &&
                !relatedTarget.classList.contains(styles.Item) &&
                !relatedTarget.classList.contains(styles.DisclosureActivator)) {
                this.setState({ tabToFocus: selected });
            }
        };
        this.handleBlur = (event) => {
            // If we blur and the target is not another tab, forget the focus position
            if (event.relatedTarget == null) {
                this.setState({ tabToFocus: -1 });
                return;
            }
            const target = event.relatedTarget;
            // If we are going to anywhere other than another tab, lose the last focused tab
            if (target instanceof HTMLElement &&
                !target.classList.contains(styles.Tab) &&
                !target.classList.contains(styles.Item)) {
                this.setState({ tabToFocus: -1 });
            }
        };
        this.handleDisclosureActivatorClick = () => {
            this.setState(({ showDisclosure }) => ({ showDisclosure: !showDisclosure }));
        };
        this.handleClose = () => {
            this.setState({
                showDisclosure: false,
            });
        };
        this.handleMeasurement = (measurements) => {
            const { tabs, selected } = this.props;
            const { tabToFocus } = this.state;
            const { hiddenTabWidths: tabWidths, containerWidth, disclosureWidth, } = measurements;
            const { visibleTabs, hiddenTabs } = getVisibleAndHiddenTabIndices(tabs, selected, disclosureWidth, tabWidths, containerWidth);
            this.setState({
                tabToFocus: tabToFocus === -1 ? -1 : selected,
                visibleTabs,
                hiddenTabs,
                disclosureWidth,
                containerWidth,
                tabWidths,
            });
        };
        this.handleTabClick = (id) => {
            const { tabs, onSelect = noop } = this.props;
            const tab = tabs.find((aTab) => aTab.id === id);
            if (tab == null) {
                return;
            }
            const selectedIndex = tabs.indexOf(tab);
            onSelect(selectedIndex);
        };
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        const { disclosureWidth, tabWidths, containerWidth } = prevState;
        const { visibleTabs, hiddenTabs } = getVisibleAndHiddenTabIndices(nextProps.tabs, nextProps.selected, disclosureWidth, tabWidths, containerWidth);
        return {
            visibleTabs,
            hiddenTabs,
            selected: nextProps.selected,
        };
    }
    render() {
        const { tabs, selected, fitted, children, polaris: { intl }, } = this.props;
        const { tabToFocus, visibleTabs, hiddenTabs, showDisclosure } = this.state;
        const disclosureTabs = hiddenTabs.map((tabIndex) => tabs[tabIndex]);
        const { newDesignLanguage } = this.context || {};
        const panelMarkup = children
            ? tabs.map((_tab, index) => {
                return selected === index ? (<Panel id={tabs[index].panelID || `${tabs[index].id}-panel`} tabID={tabs[index].id} key={tabs[index].id}>
              {children}
            </Panel>) : (<Panel id={tabs[index].panelID || `${tabs[index].id}-panel`} tabID={tabs[index].id} key={tabs[index].id} hidden/>);
            })
            : null;
        const tabsMarkup = visibleTabs
            .sort((tabA, tabB) => tabA - tabB)
            .map((tabIndex) => this.renderTabMarkup(tabs[tabIndex], tabIndex));
        const disclosureActivatorVisible = visibleTabs.length < tabs.length;
        const classname = classNames(styles.Tabs, fitted && styles.fitted, disclosureActivatorVisible && styles.fillSpace, newDesignLanguage && styles.newDesignLanguage);
        const wrapperClassName = classNames(styles.Wrapper, newDesignLanguage && styles.newDesignLanguage);
        const disclosureTabClassName = classNames(styles.DisclosureTab, disclosureActivatorVisible && styles['DisclosureTab-visible']);
        const activator = (<button type="button" className={styles.DisclosureActivator} onClick={this.handleDisclosureActivatorClick} aria-label={intl.translate('Polaris.Tabs.toggleTabsLabel')}>
        <span className={styles.Title}>
          <Icon source={HorizontalDotsMinor}/>
        </span>
      </button>);
        return (<div>
        <div className={wrapperClassName}>
          <ul role="tablist" className={classname} onFocus={this.handleFocus} onBlur={this.handleBlur} onKeyDown={handleKeyDown} onKeyUp={this.handleKeyPress}>
            {tabsMarkup}
            <li className={disclosureTabClassName}>
              <Popover preferredPosition="below" activator={activator} active={disclosureActivatorVisible && showDisclosure} onClose={this.handleClose}>
                <List focusIndex={hiddenTabs.indexOf(tabToFocus)} disclosureTabs={disclosureTabs} onClick={this.handleTabClick} onKeyPress={this.handleKeyPress}/>
              </Popover>
            </li>
          </ul>
          <TabMeasurer tabToFocus={tabToFocus} activator={activator} selected={selected} tabs={tabs} siblingTabHasFocus={tabToFocus > -1} handleMeasurement={this.handleMeasurement}/>
        </div>
        {panelMarkup}
      </div>);
    }
}
TabsInner.contextType = FeaturesContext;
function noop() { }
function handleKeyDown(event) {
    const { key } = event;
    if (key === 'ArrowUp' ||
        key === 'ArrowDown' ||
        key === 'ArrowLeft' ||
        key === 'ArrowRight') {
        event.preventDefault();
        event.stopPropagation();
    }
}
export const Tabs = withAppProvider()(TabsInner);
