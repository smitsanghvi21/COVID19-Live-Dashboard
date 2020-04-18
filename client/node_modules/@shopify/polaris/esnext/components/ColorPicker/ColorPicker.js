import React from 'react';
import { clamp } from '@shopify/javascript-utilities/math';
import { hsbToRgb } from '../../utilities/color-transformers';
import { AlphaPicker, HuePicker, Slidable } from './components';
import styles from './ColorPicker.scss';
export class ColorPicker extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.state = {
            pickerSize: 0,
        };
        this.colorNode = null;
        this.setColorNode = (node) => {
            this.colorNode = node;
        };
        this.handleHueChange = (hue) => {
            const { color: { brightness, saturation, alpha = 1 }, onChange, } = this.props;
            onChange({ hue, brightness, saturation, alpha });
        };
        this.handleAlphaChange = (alpha) => {
            const { color: { hue, brightness, saturation }, onChange, } = this.props;
            onChange({ hue, brightness, saturation, alpha });
        };
        this.handleDraggerMove = ({ x, y }) => {
            const { pickerSize } = this.state;
            const { color: { hue, alpha = 1 }, onChange, } = this.props;
            const saturation = clamp(x / pickerSize, 0, 1);
            const brightness = clamp(1 - y / pickerSize, 0, 1);
            onChange({ hue, saturation, brightness, alpha });
        };
        this.handlePickerDrag = (event) => {
            // prevents external elements from being selected
            event.preventDefault();
        };
    }
    componentDidMount() {
        const { colorNode } = this;
        if (colorNode == null) {
            return;
        }
        this.setState({ pickerSize: colorNode.clientWidth });
        if (process.env.NODE_ENV === 'development') {
            setTimeout(() => {
                this.setState({ pickerSize: colorNode.clientWidth });
            }, 0);
        }
    }
    render() {
        const { id, color, allowAlpha } = this.props;
        const { hue, saturation, brightness, alpha: providedAlpha } = color;
        const { pickerSize } = this.state;
        const alpha = providedAlpha != null && allowAlpha ? providedAlpha : 1;
        const { red, green, blue } = hsbToRgb({ hue, saturation: 1, brightness: 1 });
        const colorString = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
        const draggerX = clamp(saturation * pickerSize, 0, pickerSize);
        const draggerY = clamp(pickerSize - brightness * pickerSize, 0, pickerSize);
        const alphaSliderMarkup = allowAlpha ? (<AlphaPicker alpha={alpha} color={color} onChange={this.handleAlphaChange}/>) : null;
        return (<div className={styles.ColorPicker} id={id} onMouseDown={this.handlePickerDrag}>
        <div ref={this.setColorNode} className={styles.MainColor}>
          <div className={styles.ColorLayer} style={{ backgroundColor: colorString }}/>
          <Slidable onChange={this.handleDraggerMove} draggerX={draggerX} draggerY={draggerY}/>
        </div>
        <HuePicker hue={hue} onChange={this.handleHueChange}/>
        {alphaSliderMarkup}
      </div>);
    }
}
