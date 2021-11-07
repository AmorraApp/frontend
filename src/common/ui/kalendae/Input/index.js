import { cl as classNames, marshal } from 'common/utils';
import PropTypes from 'prop-types';
import { useState, createRef, useCallback } from 'react';
import { useSilentState, useGettableState, useDefer } from 'common/hooks';
import usePopper from 'common/hooks/usePopper';
import Kalendae from '../Kalendae';
import { prepareKalendaeContext, KalendaeContextProvider } from '../lib/useKalendaeContext';
import { SelectionProvider } from '../lib/useSelection';
import { ViewProvider } from '../lib/useViewManager';
import KalendaeInputFields from './InputFields';
import ViewResetter from './ViewResetter';
import CalendarAlt from 'common/svgs/regular/calendar-alt.svg';
import styles from './kalendae-input.scss';
import FormControl from 'common/ui/input/Control';
import useInputContext from 'common/ui/input/useInputContext';

function propTypeChar (props, propName, componentName) {
  const prop = props[propName];
  if (typeof prop !== 'string' || prop.length !== 1) {
    return new Error(`${propName} passed to ${componentName} must be a single character string. Received "${prop}"`);
  }
}

const propTypes = {

  /**
     * Input size variants
     *
     * @type {('sm'|'lg')}
     */
  size: PropTypes.string,

  /** Make the control disabled */
  disabled: PropTypes.bool,

  /**
   * The `value` attribute of underlying input
   *
   * @controllable onChange
   * */
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date),
    PropTypes.arrayOf(PropTypes.instanceOf(Date)),
  ]),

  /** A callback fired when the `value` prop changes */
  onChange: PropTypes.func,

  /**
     * Uses `controlId` from `<FormGroup>` if not explicitly specified.
     */
  id: PropTypes.string,

  /** Add "valid" validation styles to the control */
  isValid: PropTypes.bool,

  /** Add "invalid" validation styles to the control and accompanying label */
  isInvalid: PropTypes.bool,

  readOnly: PropTypes.bool,

  mode: Kalendae.propTypes.mode,
  months: PropTypes.number,
  columns: Kalendae.propTypes.columns,
  weekStart: Kalendae.propTypes.weekStart,
  direction: Kalendae.propTypes.direction,
  directionScrolling: Kalendae.propTypes.directionScrolling,
  blackout: Kalendae.propTypes.blackout,
  viewStartDate: PropTypes.instanceOf(Date),
  startDate: PropTypes.instanceOf(Date),
  endDate: PropTypes.instanceOf(Date),
  today: PropTypes.instanceOf(Date),
  parse: PropTypes.oneOfType([ PropTypes.func, PropTypes.string ]),
  locale: Kalendae.propTypes.locale,
  formats: PropTypes.shape({
    columnHeaderLong:  PropTypes.string,
    columnHeaderShort: PropTypes.string,
    titleMonth:        PropTypes.string,
    titleYear:         PropTypes.string,
    dayNumber:         PropTypes.string,
  }),
  classes: PropTypes.object,
  dayClassName: PropTypes.func,
  dayOutOfMonthClickable: PropTypes.bool,
  dayHeaderClickable: PropTypes.bool,
  hideNav: Kalendae.propTypes.hideNav,

  placement: PropTypes.oneOf([
    'auto',
    'auto-start',
    'auto-end',
    'top',
    'top-start',
    'top-end',
    'bottom',
    'bottom-start',
    'bottom-end',
    'right',
    'right-start',
    'right-end',
    'left',
    'left-start',
    'left-end',
  ]),

  format: PropTypes.string,
  placeholder: PropTypes.string,
  mask: PropTypes.string,
  maskPlaceholder: propTypeChar,
};

const defaultProps = {
  ...Kalendae.defaultProps,
  format: 'LL/dd/yyyy',
  placeholder: 'MM/DD/YYYY',
  mask: '##/##/####',
  maskPlaceholder: ' ',
};

const DatePicker = ({
  className,
  placement,
  ...props
}) => {

  const { controlId, disabled: contextDisabled } = useInputContext();
  if (contextDisabled) props.disabled = contextDisabled;
  if (controlId && !props.id) props.id = controlId;

  const propsMap = {
    kalendae: Object.keys(Kalendae.propTypes),
    input: [
      'disabled',
      'id',
      'isValid',
      'isInvalid',
      'readOnly',
      'format',
      'placeholder',
      'mask',
      'maskPlaceholder',
    ],
  };

  const { kalendaeProps, inputProps, rootProps } = marshal(props, (value, key) => {
    if (propsMap.kalendae.includes(key)) return 'kalendaeProps';
    if (propsMap.input.includes(key)) return 'inputProps';
    return 'rootProps';
  });

  const context = prepareKalendaeContext(kalendaeProps);

  const [ referenceElement, setReferenceElement ] = useState(null);
  const [ popperElement, setPopperElement ] = useState(null);
  const { styles: popperStyles, attributes: popperAttributes, update: updatePopper } = usePopper(referenceElement, popperElement, {
    placement,
  });

  const defer = useDefer();
  const [ , setMouseDown, getMouseDown ] = useSilentState(false);
  const [ _focused, setFocus, getFocus ] = useGettableState(false);
  const focused = !!_focused;

  const onFocus = useCallback((ev) => {
    defer.clear();

    if (getFocus() !== ev.target) setFocus(ev.target);
    updatePopper();
  }, [ updatePopper, getFocus, setFocus ]);

  const onBlur = useCallback((ev) => {
    const focusedTarget = getFocus();
    if (!focusedTarget) return;
    if (ev.currentTarget.contains(ev.relatedTarget)) {
      // focus moved from child to child
      if (focusedTarget !== ev.relatedTarget) setFocus(ev.relatedTarget);
    } else if (getMouseDown() && focusedTarget) {
      focusedTarget.focus();
    } else {
      defer.set(() => {
        if (getFocus()) setFocus(null);
      });
    }
  }, [ getFocus, setFocus ]);

  const kalMouseDown = useCallback(() => {
    setMouseDown(true);
  });

  const kalMouseUp = useCallback(() => {
    const focusedTarget = getFocus();
    if (focusedTarget) focusedTarget.focus();
    setMouseDown(false);
  }, [ getFocus, setMouseDown ]);

  const firstInput = createRef();
  const onRootMouseDown = useCallback((ev) => {
    const { target, currentTarget } = ev;
    if (target !== currentTarget) return;
    if (firstInput.current) {
      firstInput.current.focus();
      ev.preventDefault();
    }
  });
  const onIconMouseDown = useCallback((ev) => {
    if (firstInput.current) {
      firstInput.current.focus();
      ev.preventDefault();
    }
  });

  const rootClasses = classNames(
    className,
    styles.root,
    styles['form-control'],
    styles[`mode-${context.mode.toLowerCase()}`],
    focused && styles.focus,
    props.disabled && styles.disabled,
    props.readOnly && styles.readonly,
  );

  return (
    <KalendaeContextProvider context={context}>
      <SelectionProvider context={context}>
        <ViewProvider context={context}>
          <FormControl
            {...rootProps}
            className={rootClasses}
            onFocus={onFocus}
            onBlur={onBlur}
            ref={setReferenceElement}
            onMouseDown={onRootMouseDown}
            focused={focused}
            disabled={props.disabled}
          >
            <div className={styles.icon} onMouseDown={onIconMouseDown}><CalendarAlt /></div>
            <KalendaeInputFields {...inputProps} ref={firstInput} onIconMouseDown={onIconMouseDown} focused={focused} />
            <div
              ref={setPopperElement}
              className={styles.popper}
              style={{ ...popperStyles.popper, display: focused ? 'block' : 'none' }}
              {...popperAttributes.popper}
            >
              <ViewResetter focused={focused} />
              <Kalendae
                className={styles.kalendae}
                onMouseDown={kalMouseDown}
                onMouseUp={kalMouseUp}
              />
            </div>
          </FormControl>
        </ViewProvider>
      </SelectionProvider>
    </KalendaeContextProvider>
  );
};
DatePicker.displayName = 'DatePicker';
DatePicker.propTypes = propTypes;
DatePicker.defaultProps = defaultProps;
export default DatePicker;
