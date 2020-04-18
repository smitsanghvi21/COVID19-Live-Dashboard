import React from 'react';
import { Slidable } from '../Slidable';
import styles from '../../ColorPicker.scss';
import { calculateDraggerY, hueForDraggerY } from './utilities';
export class HuePicker extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.state = {
            sliderHeight: 0,
            draggerHeight: 0,
        };
        this.setSliderHeight = (node) => {
            if (node == null) {
                return;
            }
            this.setState({ sliderHeight: node.clientHeight });
            if (process.env.NODE_ENV === 'development') {
                setTimeout(() => {
                    this.setState({ sliderHeight: node.clientHeight });
                }, 0);
            }
        };
        this.setDraggerHeight = (height) => {
            this.setState({
                draggerHeight: height,
            });
        };
        this.handleChange = ({ y }) => {
            const { onChange } = this.props;
            const { sliderHeight } = this.state;
            const hue = hueForDraggerY(y, sliderHeight);
            onChange(hue);
        };
    }
    render() {
        const { hue } = this.props;
        const { sliderHeight, draggerHeight } = this.state;
        const draggerY = calculateDraggerY(hue, sliderHeight, draggerHeight);
        return (<div className={styles.HuePicker} ref={this.setSliderHeight}>
        <Slidable draggerY={draggerY} draggerX={0} onChange={this.handleChange} onDraggerHeight={this.setDraggerHeight}/>
      </div>);
    }
}
