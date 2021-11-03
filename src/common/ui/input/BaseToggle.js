import { cl as classNames } from 'common/utils';
import PropTypes from 'common/prop-types';
import { forwardRef, useRef, useEffect, useMemo } from 'react';
import Feedback from './Feedback';
import * as styles from './input.scss';
import useMergedRefs from 'common/hooks/useMergedRefs';
import useInputContext from './useInputContext';
import { v4 as uuid } from 'uuid';

const VARIANTS = [
  'primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark',
  'brand', 'grade-a', 'grade-b', 'grade-c', 'grade-d', 'grade-f',
];

const propTypes = {

  /**
   * The underlying HTML element to use when rendering the BaseToggle.
   *
   * @type {('input'|elementType)}
   */
  as: PropTypes.elementType,

  labelAs: PropTypes.elementType,

  name: PropTypes.string,

  /**
   * A HTML id attribute, necessary for proper form accessibility.
   * An id is recommended for allowing label clicks to toggle the check control.
   *
   * This is **required** for custom check controls or when `type="switch"` due to
   * how they are rendered.
   */
  id: PropTypes.string,

  /**
   * Groups controls horizontally with other `BaseToggle`s.
   */
  inline: PropTypes.bool,

  /**
   * Disables the control.
   */
  disabled: PropTypes.bool,

  /**
   * Sets the checkbox to an indeterminate visual state
   * Currently only implemented for switches.
   */
  indeterminate: PropTypes.bool,

  /**
   * `title` attribute for the underlying `BaseToggleLabel`.
   */
  title: PropTypes.string,

  /**
   * Label for the control.
   */
  label: PropTypes.node,

  /*
   * Prevents word wrap for the label
   */
  nowrap: PropTypes.bool,

  /**
   * Input size variants
   *
   * @type {('sm'|'lg')}
   */
  size: PropTypes.string,

  /**
     * The visual style of the badge
     *
     * @type {('primary'|'secondary'|'success'|'danger'|'warning'|'info'|'light'|'dark')}
     */
  variant: PropTypes.oneOf(VARIANTS),

  /** Use Bootstrap's custom form elements to replace the browser defaults */
  custom: PropTypes.bool,

  /**
   * The type of checkable.
   * @type {('radio' | 'checkbox' | 'switch' | 'disclosure')}
   */
  type: PropTypes.all(
    PropTypes.oneOf([ 'radio', 'checkbox', 'switch', 'disclosure' ]),
    ({ type, custom }) => (
      type === 'switch' && custom === false
        ? Error('`custom` cannot be set to `false` when the type is `switch`')
        : null
    ),
  ),

  /** Manually style the input as valid */
  isValid: PropTypes.bool,

  /** Manually style the input as invalid */
  isInvalid: PropTypes.bool,

  /** Display feedback as a tooltip. */
  feedbackTooltip: PropTypes.bool,

  /** A message to display when the input is in a validation state */
  feedback: PropTypes.node,

  onChange: PropTypes.func,
  value: PropTypes.bool,

  /** The HTML for attribute for associating the label with an input */
  htmlFor: PropTypes.string,

};

const BaseToggle = forwardRef(({
  id,
  name,
  inline = false,
  disabled = false,
  indeterminate = false,
  isValid = false,
  isInvalid = false,
  feedbackTooltip = false,
  feedback,
  htmlFor,
  className,
  style,
  title = '',
  type = 'radio',
  label,
  nowrap,
  size,
  variant,
  onChange,
  value,
  children,
  custom: propCustom,
  as: InputComponent = 'input',
  labelAs: LabelComponent = 'label',
  ...props
}, ref) => {

  const { controlId: contextId, custom: contextCustom } = useInputContext();
  const controlId = useMemo(() => id || contextId || uuid().replace(/[^a-zA-Z0-9]/g, '').substr(-8), [ id, contextId ]);

  const custom = type === 'switch' || type === 'disclosure' ? true : propCustom || contextCustom;
  const prefix = custom
    ? 'custom-control'
    : 'form-check';

  const localRef = useRef();
  ref = useMergedRefs(localRef, ref);

  useEffect(() => {
    localRef.current.checked = !!value;
    localRef.current.indeterminate = !!indeterminate;
  }, [ indeterminate, value ]);

  const hasLabel = custom || (!!label);

  const handleChange = (ev) => {
    const { checked } = ev.target;
    if (onChange && checked !== value) onChange(checked);
  };

  return (
    <div
      style={style}
      className={classNames(
        className,
        styles[prefix],
        custom && styles[`custom-${type}`],
        inline && styles[`${prefix}-inline`],
        size && styles[`${prefix}-${size}`],
        variant && styles[`${prefix}-${variant}`],
        indeterminate && styles[`${prefix}-indeterminate`],
      )}
    >
      <InputComponent
        {...props}
        id={controlId}
        name={name}
        type={type === 'switch' || type === 'disclosure' ? 'checkbox' : type}
        ref={ref}
        checked={value}
        disabled={disabled || (type === 'switch' && indeterminate)}
        onChange={handleChange}
        className={classNames(
          className,
          styles[`${prefix}-input`],
          isValid && styles['is-valid'],
          isInvalid && styles['is-invalid'],
          !hasLabel && styles['position-static'],
        )}
      />
      {hasLabel && (
        <LabelComponent
          title={title}
          htmlFor={htmlFor || controlId}
          className={classNames(
            className,
            styles[`${prefix}-label`],
            nowrap && styles['form-label-nowrap'],
          )}
        >
          {label}
          {type === 'switch' && indeterminate !== undefined &&
            <div className={styles[`${prefix}-indeterminate-spinner`]}>
              {[ ...Array(12) ].map((_, index) => <div key={index} />)}
            </div>
          }
          {children}
        </LabelComponent>
      )}
      {(isValid || isInvalid) && (
        <Feedback type={isValid ? 'valid' : 'invalid'} tooltip={feedbackTooltip}>
          {feedback}
        </Feedback>
      )}
    </div>
  );
});
BaseToggle.displayName = 'BaseToggle';
BaseToggle.propTypes = propTypes;
BaseToggle.VARIANTS = VARIANTS;
export default BaseToggle;
