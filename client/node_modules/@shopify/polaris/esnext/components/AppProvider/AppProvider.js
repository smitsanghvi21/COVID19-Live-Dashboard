import React from 'react';
import { ThemeProvider } from '../ThemeProvider';
import { MediaQueryProvider } from '../MediaQueryProvider';
import { FocusManager } from '../FocusManager';
import { I18n, I18nContext } from '../../utilities/i18n';
import { ScrollLockManager, ScrollLockManagerContext, } from '../../utilities/scroll-lock-manager';
import { createAppBridge, AppBridgeContext, } from '../../utilities/app-bridge';
import { StickyManager, StickyManagerContext, } from '../../utilities/sticky-manager';
import { LinkContext } from '../../utilities/link';
import { FeaturesContext } from '../../utilities/features';
import { UniqueIdFactory, UniqueIdFactoryContext, globalIdGeneratorFactory, } from '../../utilities/unique-id';
export class AppProvider extends React.Component {
    constructor(props) {
        super(props);
        this.stickyManager = new StickyManager();
        this.scrollLockManager = new ScrollLockManager();
        this.uniqueIdFactory = new UniqueIdFactory(globalIdGeneratorFactory);
        const { i18n, apiKey, shopOrigin, forceRedirect, linkComponent } = this.props;
        // eslint-disable-next-line react/state-in-constructor
        this.state = {
            link: linkComponent,
            intl: new I18n(i18n),
            appBridge: createAppBridge({ shopOrigin, apiKey, forceRedirect }),
        };
    }
    componentDidMount() {
        if (document != null) {
            this.stickyManager.setContainer(document);
        }
    }
    componentDidUpdate({ i18n: prevI18n, linkComponent: prevLinkComponent, apiKey: prevApiKey, shopOrigin: prevShopOrigin, forceRedirect: prevForceRedirect, }) {
        const { i18n, linkComponent, apiKey, shopOrigin, forceRedirect } = this.props;
        if (i18n === prevI18n &&
            linkComponent === prevLinkComponent &&
            apiKey === prevApiKey &&
            shopOrigin === prevShopOrigin &&
            forceRedirect === prevForceRedirect) {
            return;
        }
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({
            link: linkComponent,
            intl: new I18n(i18n),
            appBridge: createAppBridge({ shopOrigin, apiKey, forceRedirect }),
        });
    }
    render() {
        const { theme = {}, children } = this.props;
        const { intl, appBridge, link } = this.state;
        const features = Object.assign({ newDesignLanguage: false }, this.props.features);
        return (<FeaturesContext.Provider value={features}>
        <I18nContext.Provider value={intl}>
          <ScrollLockManagerContext.Provider value={this.scrollLockManager}>
            <StickyManagerContext.Provider value={this.stickyManager}>
              <UniqueIdFactoryContext.Provider value={this.uniqueIdFactory}>
                <AppBridgeContext.Provider value={appBridge}>
                  <LinkContext.Provider value={link}>
                    <ThemeProvider theme={theme}>
                      <MediaQueryProvider>
                        <FocusManager>{children}</FocusManager>
                      </MediaQueryProvider>
                    </ThemeProvider>
                  </LinkContext.Provider>
                </AppBridgeContext.Provider>
              </UniqueIdFactoryContext.Provider>
            </StickyManagerContext.Provider>
          </ScrollLockManagerContext.Provider>
        </I18nContext.Provider>
      </FeaturesContext.Provider>);
    }
}
