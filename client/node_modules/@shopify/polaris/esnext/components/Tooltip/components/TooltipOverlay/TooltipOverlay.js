import React from 'react';
import { classNames } from '../../../../utilities/css';
import { layer } from '../../../shared';
import { PositionedOverlay, } from '../../../PositionedOverlay';
import styles from '../../Tooltip.scss';
export class TooltipOverlay extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.renderOverlay = () => {
            const { active, activator, preferredPosition = 'below' } = this.props;
            return (<PositionedOverlay active={active} activator={activator} preferredPosition={preferredPosition} render={this.renderTooltip}/>);
        };
        this.renderTooltip = (overlayDetails) => {
            const { measuring, desiredHeight, positioning } = overlayDetails;
            const { id, children, light } = this.props;
            const containerClassName = classNames(styles.Tooltip, light && styles.light, measuring && styles.measuring, positioning === 'above' && styles.positionedAbove);
            const contentStyles = measuring ? undefined : { minHeight: desiredHeight };
            return (<div className={containerClassName} {...layer.props}>
        <div className={styles.Wrapper}>
          <div id={id} role="tooltip" className={styles.Content} style={contentStyles}>
            {children}
          </div>
        </div>
      </div>);
        };
    }
    render() {
        const markup = this.props.active ? this.renderOverlay() : null;
        return markup;
    }
}
