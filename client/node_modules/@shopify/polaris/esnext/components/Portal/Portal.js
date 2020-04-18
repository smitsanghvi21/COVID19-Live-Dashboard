import React from 'react';
import { createPortal } from 'react-dom';
import { createUniqueIDFactory } from '@shopify/javascript-utilities/other';
import { ThemeContext } from '../../utilities/theme';
import { portal } from '../shared';
const getUniqueID = createUniqueIDFactory('portal-');
export class Portal extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.state = { isMounted: false };
        this.portalNode = null;
        this.portalId = this.props.idPrefix !== ''
            ? `${this.props.idPrefix}-${getUniqueID()}`
            : getUniqueID();
    }
    componentDidMount() {
        this.portalNode = document.createElement('div');
        this.portalNode.setAttribute(portal.props[0], this.portalId);
        if (this.context != null) {
            const { cssCustomProperties } = this.context;
            if (cssCustomProperties != null) {
                this.portalNode.setAttribute('style', cssCustomProperties);
            }
            else {
                this.portalNode.removeAttribute('style');
            }
        }
        document.body.appendChild(this.portalNode);
        this.setState({ isMounted: true });
    }
    componentDidUpdate(_, prevState) {
        const { onPortalCreated = noop } = this.props;
        if (this.portalNode && this.context != null) {
            const { cssCustomProperties, textColor } = this.context;
            if (cssCustomProperties != null) {
                const style = `${cssCustomProperties};color:${textColor};`;
                this.portalNode.setAttribute('style', style);
            }
            else {
                this.portalNode.removeAttribute('style');
            }
        }
        if (!prevState.isMounted && this.state.isMounted) {
            onPortalCreated();
        }
    }
    componentWillUnmount() {
        if (this.portalNode) {
            document.body.removeChild(this.portalNode);
        }
    }
    render() {
        return this.portalNode && this.state.isMounted
            ? createPortal(this.props.children, this.portalNode)
            : null;
    }
}
Portal.defaultProps = { idPrefix: '' };
Portal.contextType = ThemeContext;
function noop() { }
