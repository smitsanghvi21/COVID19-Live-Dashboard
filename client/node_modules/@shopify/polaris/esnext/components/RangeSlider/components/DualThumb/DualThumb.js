import React from 'react';
import debounce from 'lodash/debounce';
import { addEventListener, removeEventListener, } from '@shopify/javascript-utilities/events';
import isEqual from 'lodash/isEqual';
import { classNames } from '../../../../utilities/css';
import { FeaturesContext } from '../../../../utilities/features';
import { CSS_VAR_PREFIX } from '../../utilities';
import { Labelled, labelID } from '../../../Labelled';
import { EventListener } from '../../../EventListener';
import { Key } from '../../../../types';
import styles from './DualThumb.scss';
var Control;
(function (Control) {
    Control[Control["Lower"] = 0] = "Lower";
    Control[Control["Upper"] = 1] = "Upper";
})(Control || (Control = {}));
export class DualThumb extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            value: sanitizeValue(this.props.value, this.props.min, this.props.max, this.props.step),
            trackWidth: 0,
            trackLeft: 0,
        };
        this.track = React.createRef();
        this.trackWrapper = React.createRef();
        this.thumbLower = React.createRef();
        this.thumbUpper = React.createRef();
        this.setTrackPosition = debounce(() => {
            if (this.track.current) {
                const newDesignLanguage = this.context && this.context.newDesignLanguage;
                const thumbSize = newDesignLanguage ? 16 : 24;
                const { width, left } = this.track.current.getBoundingClientRect();
                const adjustedTrackWidth = width - thumbSize;
                const adjustedTrackLeft = left + thumbSize / 2;
                this.setState({
                    trackWidth: adjustedTrackWidth,
                    trackLeft: adjustedTrackLeft,
                });
            }
        }, 40, { leading: true, trailing: true, maxWait: 40 });
        this.handleMouseDownThumbLower = (event) => {
            if (event.button !== 0 || this.props.disabled)
                return;
            registerMouseMoveHandler(this.handleMouseMoveThumbLower);
            event.stopPropagation();
        };
        this.handleMouseMoveThumbLower = (event) => {
            const valueUpper = this.state.value[1];
            this.setValue([this.actualXPosition(event.clientX), valueUpper], Control.Upper);
        };
        this.handleTouchStartThumbLower = (event) => {
            if (this.props.disabled)
                return;
            registerTouchMoveHandler(this.handleTouchMoveThumbLower);
            event.stopPropagation();
        };
        this.handleTouchMoveThumbLower = (event) => {
            event.preventDefault();
            const valueUpper = this.state.value[1];
            this.setValue([this.actualXPosition(event.touches[0].clientX), valueUpper], Control.Upper);
        };
        this.handleMouseDownThumbUpper = (event) => {
            if (event.button !== 0 || this.props.disabled)
                return;
            registerMouseMoveHandler(this.handleMouseMoveThumbUpper);
            event.stopPropagation();
        };
        this.handleMouseMoveThumbUpper = (event) => {
            const valueLower = this.state.value[0];
            this.setValue([valueLower, this.actualXPosition(event.clientX)], Control.Lower);
        };
        this.handleTouchStartThumbUpper = (event) => {
            if (this.props.disabled)
                return;
            registerTouchMoveHandler(this.handleTouchMoveThumbUpper);
            event.stopPropagation();
        };
        this.handleTouchMoveThumbUpper = (event) => {
            event.preventDefault();
            const valueLower = this.state.value[0];
            this.setValue([valueLower, this.actualXPosition(event.touches[0].clientX)], Control.Lower);
        };
        this.handleKeypressLower = (event) => {
            if (this.props.disabled)
                return;
            const { incrementValueLower, decrementValueLower } = this;
            const handlerMap = {
                [Key.UpArrow]: incrementValueLower,
                [Key.RightArrow]: incrementValueLower,
                [Key.DownArrow]: decrementValueLower,
                [Key.LeftArrow]: decrementValueLower,
            };
            const handler = handlerMap[event.keyCode];
            if (handler != null) {
                event.preventDefault();
                event.stopPropagation();
                handler();
            }
        };
        this.handleKeypressUpper = (event) => {
            if (this.props.disabled)
                return;
            const { incrementValueUpper, decrementValueUpper } = this;
            const handlerMap = {
                [Key.UpArrow]: incrementValueUpper,
                [Key.RightArrow]: incrementValueUpper,
                [Key.DownArrow]: decrementValueUpper,
                [Key.LeftArrow]: decrementValueUpper,
            };
            const handler = handlerMap[event.keyCode];
            if (handler != null) {
                event.preventDefault();
                event.stopPropagation();
                handler();
            }
        };
        this.incrementValueLower = () => {
            this.setValue([this.state.value[0] + this.props.step, this.state.value[1]], Control.Upper);
        };
        this.decrementValueLower = () => {
            this.setValue([this.state.value[0] - this.props.step, this.state.value[1]], Control.Upper);
        };
        this.incrementValueUpper = () => {
            this.setValue([this.state.value[0], this.state.value[1] + this.props.step], Control.Lower);
        };
        this.decrementValueUpper = () => {
            this.setValue([this.state.value[0], this.state.value[1] - this.props.step], Control.Lower);
        };
        this.dispatchValue = () => {
            const { onChange, id } = this.props;
            const { value } = this.state;
            onChange(value, id);
        };
        this.setValue = (dirtyValue, control) => {
            const { props: { min, max, step }, state: { value }, } = this;
            const sanitizedValue = sanitizeValue(dirtyValue, min, max, step, control);
            if (isEqual(sanitizedValue, value) === false) {
                this.setState({
                    value: sanitizedValue,
                }, this.dispatchValue);
            }
        };
        this.handleMouseDownTrack = (event) => {
            if (event.button !== 0 || this.props.disabled)
                return;
            event.preventDefault();
            const clickXPosition = this.actualXPosition(event.clientX);
            const { value } = this.state;
            const distanceFromLowerThumb = Math.abs(value[0] - clickXPosition);
            const distanceFromUpperThumb = Math.abs(value[1] - clickXPosition);
            if (distanceFromLowerThumb <= distanceFromUpperThumb) {
                this.setValue([clickXPosition, value[1]], Control.Upper);
                registerMouseMoveHandler(this.handleMouseMoveThumbLower);
                if (this.thumbLower.current != null) {
                    this.thumbLower.current.focus();
                }
            }
            else {
                this.setValue([value[0], clickXPosition], Control.Lower);
                registerMouseMoveHandler(this.handleMouseMoveThumbUpper);
                if (this.thumbUpper.current != null) {
                    this.thumbUpper.current.focus();
                }
            }
        };
        this.handleTouchStartTrack = (event) => {
            if (this.props.disabled)
                return;
            event.preventDefault();
            const clickXPosition = this.actualXPosition(event.touches[0].clientX);
            const { value } = this.state;
            const distanceFromLowerThumb = Math.abs(value[0] - clickXPosition);
            const distanceFromUpperThumb = Math.abs(value[1] - clickXPosition);
            if (distanceFromLowerThumb <= distanceFromUpperThumb) {
                this.setValue([clickXPosition, value[1]], Control.Upper);
                registerTouchMoveHandler(this.handleTouchMoveThumbLower);
                if (this.thumbLower.current != null) {
                    this.thumbLower.current.focus();
                }
            }
            else {
                this.setValue([value[0], clickXPosition], Control.Lower);
                registerTouchMoveHandler(this.handleTouchMoveThumbUpper);
                if (this.thumbUpper.current != null) {
                    this.thumbUpper.current.focus();
                }
            }
        };
        this.actualXPosition = (dirtyXPosition) => {
            if (this.track.current) {
                const { min, max } = this.props;
                const { trackLeft, trackWidth } = this.state;
                const relativeX = dirtyXPosition - trackLeft;
                const percentageOfTrack = relativeX / trackWidth;
                return percentageOfTrack * (max - min);
            }
            else {
                return 0;
            }
        };
    }
    static getDerivedStateFromProps(props, state) {
        const { min, step, max, value, onChange, id } = props;
        const { prevValue } = state;
        if (isEqual(prevValue, value)) {
            return null;
        }
        const sanitizedValue = sanitizeValue(value, min, max, step);
        if (!isEqual(value, sanitizedValue)) {
            onChange(sanitizedValue, id);
        }
        return {
            prevValue: value,
            value: sanitizedValue,
        };
    }
    componentDidMount() {
        this.setTrackPosition();
        if (this.trackWrapper.current != null) {
            addEventListener(this.trackWrapper.current, 'touchstart', this.handleTouchStartTrack, { passive: false });
        }
    }
    componentWillUnmount() {
        if (this.trackWrapper.current != null) {
            removeEventListener(this.trackWrapper.current, 'touchstart', this.handleTouchStartTrack);
        }
    }
    render() {
        const { id, min, max, prefix, suffix, disabled, output, error, onFocus, onBlur, label, labelAction, labelHidden, helpText, } = this.props;
        const { value } = this.state;
        const idLower = id;
        const idUpper = `${id}Upper`;
        const describedBy = [];
        if (error) {
            describedBy.push(`${id}Error`);
        }
        const ariaDescribedBy = describedBy.length
            ? describedBy.join(' ')
            : undefined;
        const trackWrapperClassName = classNames(styles.TrackWrapper, error && styles.error, disabled && styles.disabled);
        const thumbLowerClassName = classNames(styles.Thumbs, styles.ThumbLower, disabled && styles.disabled);
        const thumbUpperClassName = classNames(styles.Thumbs, styles.ThumbUpper, disabled && styles.disabled);
        const trackWidth = this.state.trackWidth;
        const range = max - min;
        const leftPositionThumbLower = (value[0] / range) * trackWidth;
        const leftPositionThumbUpper = (value[1] / range) * trackWidth;
        const outputLowerClassName = classNames(styles.Output, styles.OutputLower);
        const outputMarkupLower = !disabled && output ? (<output htmlFor={idLower} className={outputLowerClassName} style={{
            left: `${leftPositionThumbLower}px`,
        }}>
          <div className={styles.OutputBubble}>
            <span className={styles.OutputText}>{value[0]}</span>
          </div>
        </output>) : null;
        const outputUpperClassName = classNames(styles.Output, styles.OutputUpper);
        const outputMarkupUpper = !disabled && output ? (<output htmlFor={idUpper} className={outputUpperClassName} style={{
            left: `${leftPositionThumbUpper}px`,
        }}>
          <div className={styles.OutputBubble}>
            <span className={styles.OutputText}>{value[1]}</span>
          </div>
        </output>) : null;
        const cssVars = {
            [`${CSS_VAR_PREFIX}progress-lower`]: `${leftPositionThumbLower}px`,
            [`${CSS_VAR_PREFIX}progress-upper`]: `${leftPositionThumbUpper}px`,
        };
        const prefixMarkup = prefix && (<div className={styles.Prefix}>{prefix}</div>);
        const suffixMarkup = suffix && (<div className={styles.Suffix}>{suffix}</div>);
        return (<React.Fragment>
        <Labelled id={id} label={label} error={error} action={labelAction} labelHidden={labelHidden} helpText={helpText}>
          <div className={styles.Wrapper}>
            {prefixMarkup}
            <div className={trackWrapperClassName} onMouseDown={this.handleMouseDownTrack} testID="trackWrapper" ref={this.trackWrapper}>
              <div className={styles.Track} style={cssVars} ref={this.track} testID="track"/>
              <div className={styles['Track--dashed']}/>
              <button id={idLower} className={thumbLowerClassName} style={{
            left: `${leftPositionThumbLower}px`,
        }} role="slider" aria-disabled={disabled} aria-valuemin={min} aria-valuemax={max} aria-valuenow={value[0]} aria-invalid={Boolean(error)} aria-describedby={ariaDescribedBy} aria-labelledby={labelID(id)} onFocus={onFocus} onBlur={onBlur} onKeyDown={this.handleKeypressLower} onMouseDown={this.handleMouseDownThumbLower} onTouchStart={this.handleTouchStartThumbLower} ref={this.thumbLower} disabled={disabled}/>
              {outputMarkupLower}
              <button id={idUpper} className={thumbUpperClassName} style={{
            left: `${leftPositionThumbUpper}px`,
        }} role="slider" aria-disabled={disabled} aria-valuemin={min} aria-valuemax={max} aria-valuenow={value[1]} aria-invalid={Boolean(error)} aria-describedby={ariaDescribedBy} aria-labelledby={labelID(id)} onFocus={onFocus} onBlur={onBlur} onKeyDown={this.handleKeypressUpper} onMouseDown={this.handleMouseDownThumbUpper} onTouchStart={this.handleTouchStartThumbUpper} ref={this.thumbUpper} disabled={disabled}/>
              {outputMarkupUpper}
            </div>
            {suffixMarkup}
          </div>
        </Labelled>
        <EventListener event="resize" handler={this.setTrackPosition}/>
      </React.Fragment>);
    }
}
DualThumb.contextType = FeaturesContext;
function registerMouseMoveHandler(handler) {
    addEventListener(document, 'mousemove', handler);
    addEventListener(document, 'mouseup', () => {
        removeEventListener(document, 'mousemove', handler);
    }, { once: true });
}
function registerTouchMoveHandler(handler) {
    const removeHandler = () => {
        removeEventListener(document, 'touchmove', handler);
        removeEventListener(document, 'touchend', removeHandler);
        removeEventListener(document, 'touchcancel', removeHandler);
    };
    addEventListener(document, 'touchmove', handler, { passive: false });
    addEventListener(document, 'touchend', removeHandler, { once: true });
    addEventListener(document, 'touchcancel', removeHandler, { once: true });
}
function sanitizeValue(value, min, max, step, control = Control.Upper) {
    let upperValue = inBoundsUpper(roundedToStep(value[1]));
    let lowerValue = inBoundsLower(roundedToStep(value[0]));
    const maxLowerValue = upperValue - step;
    const minUpperValue = lowerValue + step;
    if (control === Control.Upper && lowerValue > maxLowerValue) {
        lowerValue = maxLowerValue;
    }
    else if (control === Control.Lower && upperValue < minUpperValue) {
        upperValue = minUpperValue;
    }
    return [lowerValue, upperValue];
    function inBoundsUpper(value) {
        const lowerMin = min + step;
        if (value < lowerMin) {
            return lowerMin;
        }
        else if (value > max) {
            return max;
        }
        else {
            return value;
        }
    }
    function inBoundsLower(value) {
        const upperMax = max - step;
        if (value < min) {
            return min;
        }
        else if (value > upperMax) {
            return upperMax;
        }
        else {
            return value;
        }
    }
    function roundedToStep(value) {
        return Math.round(value / step) * step;
    }
}
