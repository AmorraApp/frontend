import { cl as classNames } from 'common/utils';
import PropTypes from 'prop-types';
import { forwardRef, Children } from 'react';
import Feedback from './Feedback';
import styles from './input.scss';

const propTypes = {
  /**
   * Size variants
   *
   * @type {('sm'|'lg')}
   */
  size: PropTypes.string,

  placeholder: PropTypes.string,

  /**
   * The underlying HTML element to use when rendering the FormControl.
   *
   * @type {('input'|'textarea'|'select'|elementType)}
   */
  as: PropTypes.elementType,

  /** Make the control readonly */
  readOnly: PropTypes.bool,

  /** Make the control disabled */
  disabled: PropTypes.bool,

  /** Add "valid" validation styles to the control */
  isValid: PropTypes.bool,

  /** Add "invalid" validation styles to the control and accompanying label */
  isInvalid: PropTypes.bool,

  focused: PropTypes.bool,

  focusable: PropTypes.bool,

  scrolling: PropTypes.bool,

  tabIndex: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
};

const FormControl = forwardRef(({
  size,
  className,
  isValid = false,
  isInvalid = false,
  disabled = false,
  focused = false,
  focusable = false,
  scrolling = false,
  placeholder,
  readOnly,
  as: Component = 'div',
  tabIndex,
  children,
  ...props
}, ref) => {

  const classes = [
    styles['form-control'],
    size && styles[`form-control-${size}`],
    disabled && styles.disabled,
    readOnly && styles.readonly,
    isValid && styles[`is-valid`],
    isInvalid && styles[`is-invalid`],
    focused && styles.focus,
    focusable && styles.focusable,
    scrolling && styles.scrolling,
    className,
  ];

  if (focusable && tabIndex === undefined) tabIndex = 0;

  if (!children || !Children.count(children) && placeholder) {
    children = <span>{placeholder}</span>;
    classes.push(styles['form-control-placeholder']);
  }

  return (
    <Component
      {...props}
      tabIndex={tabIndex}
      ref={ref}
      className={classNames(...classes)}
    >{children}</Component>
  );
});
FormControl.displayName = 'FormControl';
FormControl.propTypes = propTypes;
export default Object.assign(FormControl, { Feedback });
