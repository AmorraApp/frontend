
import PropTypes from 'prop-types';
import { cl as classNames, isArray, isNumber, isFunction, passthru, isUndefinedOrNull, isNotUndefinedOrNull, clamp, range as mapRange, warning, shallowEqual } from 'common/utils';
import { useEffect, forwardRef, useCallback, useState, useRef, Fragment } from 'react';
import styles from './slider.scss';
import useDerivedState from 'common/hooks/useDerivedState';
import useMemoObject from 'common/hooks/useMemoObject';
import useMergedRefs from 'common/hooks/useMergedRefs';
import useGettableState from 'common/hooks/useGettableState';
import useFocus, { FocusProvider } from 'common/ui/focus';
import { useToggledGlobalListener } from 'common/hooks/useGlobalListener';
import { useEventHandlerOn } from 'common/hooks/useEventHandler';

const valuesEqual = (a, b) => !shallowEqual(a.slice().sort(asc), b.slice().sort(asc));

const axisProps = {
  horizontal: {
    offset: (percent) => ({ left: `${percent}%` }),
    leap: (percent) => ({ width: `${percent}%` }),
  },
  'horizontal-reverse': {
    offset: (percent) => ({ right: `${percent}%` }),
    leap: (percent) => ({ width: `${percent}%` }),
  },
  vertical: {
    offset: (percent) => ({ bottom: `${percent}%` }),
    leap: (percent) => ({ height: `${percent}%` }),
  },
};

const Slider = forwardRef(({
  value: oValue,
  min,
  max,
  step,
  marks,
  scale = passthru,
  orientation,
  tabIndex = 0,
  track,
  valueLabelDisplay,
  valueLabelFormat = passthru,
  defaultValue,
  className,
  disabled,
  clamp: disableSwap,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'aria-valuetext': ariaValueText,
  onChange,
  onMouseDown: onParentMouseDown,
  focusKey,
  ...props
}, ref) => {
  warning(min <= max, '`max` (%s) must be larger than `min` (%s)', max, min);
  warning(!step || step > 0, 'Step (%s) must be a positive number', step);
  if (isNaN(min)) min = null;
  if (isNaN(max)) max = null;
  if (isNaN(step) || step < 0) step = null;

  if (isNumber(marks)) marks = mapRange(min, max, marks, (value) => ({ value }));
  if (marks === true)  marks = mapRange(min, max, step, (value) => ({ value }));
  if (!marks) marks = [];

  const touchId = useRef();
  // We can't use the :active browser pseudo-classes.
  // - The active state isn't triggered when clicking on the rail.
  // - The active state isn't transferred when inversing a range slider.
  const [ active, setActive, getActive ] = useGettableState(-1);
  const [ over, setOver ] = useState(-1);
  const [ focused, setFocused ] = useGettableState(-1);

  const [ values, setValueState, getValueState ] = useDerivedState(
    () => deriveValue(oValue, { defaultValue, min, max }),
    [ useMemoObject(oValue) ],
    valuesEqual,
  );
  const range = values.length > 1;

  const trackOffset = valueToPercent(range ? Math.min(...values) : min, min, max);
  const trackLeap = valueToPercent(Math.max(...values), min, max) - trackOffset;
  const trackStyle = {
    ...axisProps[orientation].offset(track === 'inverted' ? trackLeap : trackOffset),
    ...axisProps[orientation].leap(track === 'inverted' ? 100 - trackLeap : trackLeap),
  };

  const sliderRef = useRef();
  const handleRef = useMergedRefs(sliderRef, ref);

  const { current: thumbRefs } = useRef(new Map());

  useEffect(() => {
    if (disabled && active !== -1) {
      setActive(-1);
      setFocused(-1);
      sliderRef.blur();
    }
  }, [ disabled, active ]);


  const getFingerNewValue = useCallback(({
    finger,
  }) => {
    const currentValues = getValueState();
    const { current: slider } = sliderRef;

    const { width, height, bottom, left } = slider.getBoundingClientRect();
    let percent;

    if (orientation === 'vertical') {
      percent = (bottom - finger.y) / height;
    } else {
      percent = (finger.x - left) / width;
    }

    let newValue = percentToValue(percent, min, max);

    let activeIndex = getActive();
    if (activeIndex === -1) activeIndex = findClosest(currentValues, newValue);

    if (step) {
      newValue = roundValueToStep(newValue, step, min);
    } else {
      const marksValues = marks.map((mark) => mark.value);
      const closestIndex = findClosest(marksValues, newValue);
      newValue = marksValues[closestIndex];
    }

    newValue = clamp(newValue, min, max);

    if (range) {
      // Bound the new value to the thumb's neighbours.
      if (disableSwap) {
        newValue = clamp(
          newValue,
          Math.min(...currentValues) || -Infinity,
          Math.max(currentValues) || Infinity,
        );
      }

      const newValues = [ ...currentValues.slice() ];
      newValues[activeIndex] = newValue;

      return { newValues, newValue, activeIndex };
    }

    return { newValues: [ newValue ], newValue, activeIndex };

  }, [ min, max, range, disableSwap, orientation ]);

  const handleDragStart = useCallback((ev) => {
    const finger = trackFinger(ev, touchId);
    const { newValues, activeIndex } = getFingerNewValue({ finger });

    setValueState(newValues);
    setActive(activeIndex);
    const thumb = thumbRefs.get(activeIndex);
    thumb && thumb.focus();

    onChange && onChange(newValues);
  }, [ getFingerNewValue, onChange ]);

  const handleDragMove = useCallback((ev) => {
    const finger = trackFinger(ev, touchId);

    if (!finger) {
      return;
    }

    const { newValues } = getFingerNewValue({ finger });
    setValueState(newValues);
    onChange && onChange([ ...newValues ].sort(asc));
  }, [ getFingerNewValue, onChange ]);

  const handleDragEnd = useCallback((ev) => {
    const finger = trackFinger(ev, touchId);

    if (finger) {
      const { newValues } = getFingerNewValue({ finger });
      setValueState(newValues);
      onChange && onChange([ ...newValues ].sort(asc));
    }

    setActive(-1);
    if (ev.type === 'touchend') {
      setOver(-1);
    }

    touchId.current = undefined;

    docMouseMove.remove();
    docMouseEnd.remove();
    docTouchMove.remove();
    docTouchEnd.remove();
  }, [ getFingerNewValue, onChange ]);

  const docMouseMove = useToggledGlobalListener('mousemove', handleDragMove);
  const docMouseEnd = useToggledGlobalListener('mouseup', handleDragEnd);
  const docTouchMove = useToggledGlobalListener('touchmove', handleDragMove);
  const docTouchEnd = useToggledGlobalListener('touchend', handleDragEnd);

  useEventHandlerOn(sliderRef, 'touchstart', (ev) => {
    // If touch-action: none; is not supported we need to prevent the scroll manually.

    const touch = ev.changedTouches[0];
    if (touch) {
      // A number that uniquely identifies the current finger in the touch session.
      touchId.current = touch.identifier;
    }

    handleDragStart(ev);

    docTouchMove.attach();
    docTouchEnd.attach();
  });

  const handleMouseDown = useCallback((ev) => {
    if (onParentMouseDown) {
      onParentMouseDown(ev);
      if (ev.defaultPrevented) return;
    }

    // Only handle left clicks
    if (ev.button !== 0) {
      return;
    }

    handleDragStart(ev);

    docMouseMove.attach();
    docMouseEnd.attach();
  }, [ onChange, onParentMouseDown, setValueState, getFingerNewValue ]);

  const handleKeyNavigation = useCallback((index, delta) => {
    const curValues = getValueState();

    const newValue = clamp(curValues[index] + (delta * step), min, max);
    const maxValue = Math.max(...curValues);
    const minValue = Math.min(...curValues);

    const newValues = curValues.slice();
    newValues[index] = clamp(newValues[index] + (delta * step), min, max);
    newValues.sort();

    if (newValue > maxValue) {
      const thumb = thumbRefs.get(newValues.length - 1);
      thumb && thumb.focus();
    } else if (newValue < minValue) {
      const thumb = thumbRefs.get(0);
      thumb && thumb.focus();
    }

    setValueState(newValues);
    onChange && onChange(newValues);
  }, [ onChange, step, min, max ]);


  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);

  thumbRefs.clear();
  return (
    <FocusProvider focusKey={focusKey} onChange={setFocused}>
      <div
        {...props}
        className={classNames(
          className,
          styles.slider,
          styles[orientation],
          marks.length > 0 && marks.some((mark) => mark.label) && styles.marked,
          disabled && styles.disabled,
        )}
        ref={handleRef}
        onMouseDown={handleMouseDown}
      >
        <div className={styles.rail} />
        {!!values.length && <div className={styles.track} style={trackStyle} />}
        {marks.map((mark, index) => {
          const percent = valueToPercent(mark.value, min, max);
          const style = axisProps[orientation].offset(percent);

          let markActive;
          if (track === false) {
            markActive = values.indexOf(mark.value) !== -1;
          } else {
            markActive =
              (track === true &&
                (range
                  ? mark.value >= minValue && mark.value <= maxValue
                  : mark.value <= minValue)) ||
              (track === 'inverted' &&
                (range
                  ? mark.value <= minValue || mark.value >= maxValue
                  : mark.value >= minValue));
          }

          return (
            <Fragment key={mark.value}>
              <div
                className={classNames(
                  styles.mark,
                  markActive && styles.active,
                )}
                style={style}
              />
              {isNotUndefinedOrNull(mark.label) ? (
                <div
                  aria-hidden
                  data-index={index}
                  className={classNames(
                    styles['mark-label'],
                    markActive && styles.active,
                  )}
                  style={style}
                >
                  {mark.label}
                </div>
              ) : null}
            </Fragment>
          );
        })}
        {values.map((value, index) => (
          <Thumb
            ref={(el) => { thumbRefs.set(index, el); }}
            key={index}
            index={index}
            min={min}
            max={max}
            value={value}
            active={active === index}
            over={over === index || focused === index}
            scale={scale}
            setOver={setOver}
            onKeyboardChange={handleKeyNavigation}
            tabIndex={tabIndex}
            orientation={orientation}
            valueLabelDisplay={valueLabelDisplay}
            valueLabelFormat={valueLabelFormat}
            disabled={disabled}

            aria-label={isFunction(ariaLabel) ? ariaLabel(index) : ariaLabel}
            aria-labelledby={ariaLabelledBy}
            aria-orientation={orientation}
            aria-valuemax={scale(max)}
            aria-valuemin={scale(min)}
            aria-valuenow={scale(value)}
            aria-valuetext={isFunction(ariaValueText) ? ariaValueText(scale(value), index) : ariaValueText}
          />
        ))}
      </div>
    </FocusProvider>
  );

});
Slider.displayName = 'Slider';
Slider.defaultProps = {
  max: 100,
  min: 0,
  orientation: 'horizontal',
  step: 1,
  tabIndex: 0,
  track: true,
  valueLabelDisplay: 'auto',
};
Slider.propTypes = {

  /**
   * The id of the element containing a label for the slider.
   */
  'aria-labelledby': PropTypes.string,

  'aria-label': PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
  ]),

  'aria-valuetext': PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
  ]),

  disabled: PropTypes.bool,

  /**
   * If `true`, the active thumb doesn't swap when moving pointer over a thumb while dragging another thumb.
   * @default false
   */
  clamp: PropTypes.bool,

  marks: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.node,
        value: PropTypes.number.isRequired,
      }),
    ),
    PropTypes.bool,
    PropTypes.number,
  ]),
  /**
   * The maximum allowed value of the slider.
   * Should not be equal to min.
   * @default 100
   */
  max: PropTypes.number,
  /**
   * The minimum allowed value of the slider.
   * Should not be equal to max.
   * @default 0
   */
  min: PropTypes.number,
  /**
   * The component orientation.
   * @default 'horizontal'
   */
  orientation: PropTypes.oneOf([
    'horizontal',
    'vertical',
  ]),
  /**
   * A transformation function, to change the scale of the slider.
   * @default (x) => x
   */
  scale: PropTypes.func,
  /**
   * The granularity with which the slider can step through values. (A "discrete" slider.)
   * The `min` prop serves as the origin for the valid values.
   * We recommend (max - min) to be evenly divisible by the step.
   *
   * When step is `null`, the thumb can only be slid onto marks provided with the `marks` prop.
   * @default 1
   */
  step: PropTypes.number,

  /**
   * Tab index attribute of the hidden `input` element.
   */
  tabIndex: PropTypes.number,

  /**
   * The track presentation:
   *
   * - `normal` the track will render a bar representing the slider value.
   * - `inverted` the track will render a bar representing the remaining slider value.
   * - `false` the track will render without a bar.
   * @default 'normal'
   */
  track: PropTypes.oneOf([
    'inverted',
    true,
    false,
  ]),

  /**
   * The value of the slider.
   * For ranged sliders, provide an array with two values.
   */
  value: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.number),
    PropTypes.number,
  ]),

  /**
   * The default value. Use when the component is not controlled.
   */
  defaultValue: PropTypes.oneOfType([ PropTypes.arrayOf(PropTypes.number), PropTypes.number ]),

  /**
   * Controls when the value label is displayed:
   *
   * - `auto` the value label will display when the thumb is hovered or focused.
   * - true will display persistently.
   * - false will never display.
   * @default false
   */
  valueLabelDisplay: PropTypes.oneOf([
    'auto',
    false,
    true,
  ]),
  /**
   * The format function the value label's value.
   *
   * When a function is provided, it should have the following signature:
   *
   * - {number} value The value label's value to format
   * - {number} index The value label's index to format
   * @default (x) => x
   */
  valueLabelFormat: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string,
  ]),

  onMouseDown: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,

  focusKey: PropTypes.any,
};
export default Slider;



function SliderValueLabel ({
  children,
  value,
  over,
}) {
  return (
    <div
      className={classNames(
        styles['value-label'],
        over && styles.over,
      )}
    >
      {children}
      <span className={styles.circle}>
        <span className={styles.label}>{value}</span>
      </span>
    </div>
  );
}
SliderValueLabel.propTypes = {
  value: PropTypes.string,
  over: PropTypes.bool,
};


var Thumb = forwardRef(({
  index,
  min,
  max,
  value,
  active,
  over,
  scale,
  setOver,
  onKeyboardChange,
  tabIndex,
  orientation,
  valueLabelDisplay,
  valueLabelFormat,
  disabled,
  ...props
}, ref) => {
  const { ref: focusRef } = useFocus(index);
  ref = useMergedRefs(ref, focusRef);

  const percent = valueToPercent(value, min, max);
  const style = axisProps[orientation].offset(percent);

  const ValueLabelComponent = !valueLabelDisplay ? ({ children }) => children : SliderValueLabel;

  const onKeyDown = useCallback((ev) => {
    const { key } = ev;

    let delta;
    switch (key) {
    case 'ArrowDown':
    case 'ArrowLeft':
      delta = -1;
      break;
    case 'ArrowRight':
    case 'ArrowUp':
      delta = 1;
      break;
    default: return;
    }

    onKeyboardChange && onKeyboardChange(index, delta);

  }, [ value, onKeyboardChange ]);

  return (
    <div
      {...props}
      ref={ref}
      onMouseOver={useCallback(() => setOver(index), [ setOver ])}
      onMouseLeave={useCallback(() => setOver(-1), [ setOver ])}
      className={classNames(
        styles.thumb,
        active && styles.active,
        over && styles.over,
      )}
      tabIndex={tabIndex}
      style={{
        ...style,
      }}
      onKeyDown={onKeyDown}
    >
      <ValueLabelComponent
        value={String(
          isFunction(valueLabelFormat)
            ? valueLabelFormat(scale(value), index)
            : valueLabelFormat,
        )}
        over={over || active  || valueLabelDisplay === true}
        disabled={disabled}
      />
    </div>
  );
});
Thumb.displayName = 'SliderThumb';
Thumb.propTypes = {
  index: PropTypes.number,
  min: PropTypes.number,
  max: PropTypes.number,
  value: PropTypes.number,
  active: PropTypes.bool,
  over: PropTypes.bool,
  scale: PropTypes.func,
  setOver: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onKeyboardChange: PropTypes.func,
  tabIndex: PropTypes.number,
  orientation: PropTypes.string,
  valueLabelDisplay: PropTypes.oneOf([
    'auto',
    false,
    true,
  ]),
  valueLabelFormat: PropTypes.func,
  disabled: PropTypes.bool,
};


function valueToPercent (value, min, max) {
  return ((value - min) * 100) / (max - min);
}

function percentToValue (percent, min, max) {
  return ((max - min) * percent) + min;
}

function getDecimalPrecision (num) {
  // This handles the case when num is very small (0.00000001), js will turn this into 1e-8.
  // When num is bigger than 1 or less than -1 it won't get converted to this notation so it's fine.
  if (Math.abs(num) < 1) {
    const parts = num.toExponential().split('e-');
    const matissaDecimalPart = parts[0].split('.')[1];
    return (matissaDecimalPart ? matissaDecimalPart.length : 0) + parseInt(parts[1], 10);
  }

  const decimalPart = num.toString().split('.')[1];
  return decimalPart ? decimalPart.length : 0;
}

function roundValueToStep (value, step, min) {
  const nearest = (Math.round((value - min) / step) * step) + min;
  return Number(nearest.toFixed(getDecimalPrecision(step)));
}

function deriveValue (value, { defaultValue, min, max } = {}) {
  if (isUndefinedOrNull(value)) {
    if (isUndefinedOrNull(defaultValue)) value = [];
    else value = [ defaultValue || 0 ];
  }
  if (!isArray(value)) value = [ value ];

  value = value.map((v) => clamp(v, min, max)).filter((v) => !isNaN(v)).sort(asc);
  return value;
}


function findClosest (values, currentValue) {
  if (!values.length) return -1;
  if (values.length === 1) return 0;
  const { index: closestIndex } = values.reduce((acc, value, index) => {
    const distance = Math.abs(currentValue - value);

    if (acc === null || distance < acc.distance || distance === acc.distance) {
      return {
        distance,
        index,
      };
    }

    return acc;
  }, null);
  return closestIndex;
}

function trackFinger (event, { current: touchId }) {
  if (touchId !== undefined && event.changedTouches) {
    for (let i = 0; i < event.changedTouches.length; i += 1) {
      const touch = event.changedTouches[i];
      if (touch.identifier === touchId) {
        return {
          x: touch.clientX,
          y: touch.clientY,
        };
      }
    }

    return false;
  }

  return {
    x: event.clientX,
    y: event.clientY,
  };
}


function asc (a, b) {
  return a - b;
}
