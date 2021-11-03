import { cl as classNames } from 'common/utils';
import React from 'react';
import PropTypes from 'prop-types';
import SafeAnchor from '../safe-anchor';
import * as styles from './button.scss';
export { styles as Classes };

export { default as ButtonGroup } from './ButtonGroup';
export { default as ButtonToolbar } from './ButtonToolbar';

const VARIANTS = [
  'input', 'brand', 'primary', 'secondary', 'success', 'danger', 'warning', 'info', 'dark', 'light', 'link',
  'grade-a', 'grade-b', 'grade-c', 'grade-d', 'grade-f',
  'outline-primary', 'outline-secondary', 'outline-success', 'outline-danger', 'outline-warning', 'outline-info', 'outline-dark', 'outline-light',
  'outline-grade-a', 'outline-grade-b', 'outline-grade-c', 'outline-grade-d', 'outline-grade-f',
];

const propTypes = {

  /**
     * One or more button variant combinations
     *
     * buttons may be one of a variety of visual variants such as:
     *
     * `'primary', 'secondary', 'success', 'danger', 'warning', 'info', 'dark', 'light', 'link'`
     *
     * as well as "outline" versions (prefixed by 'outline-*')
     *
     * `'outline-primary', 'outline-secondary', 'outline-success', 'outline-danger', 'outline-warning', 'outline-info', 'outline-dark', 'outline-light'`
     */
  variant: PropTypes.oneOf(VARIANTS),

  /*
    Specifies that this button should not have any padding.
   */
  gutterless: PropTypes.bool,

  /**
     * Specifies a large or small button.
     *
     * @type ('sm'|'lg')
     */
  size: PropTypes.string,

  /** Spans the full width of the Button parent */
  block: PropTypes.bool,

  /** Manually set the visual state of the button to `:active` */
  active: PropTypes.bool,

  /** Prevent hover and focus affects */
  inactive: PropTypes.bool,

  /**
     * Disables the Button, preventing mouse events,
     * even if the underlying component is an `<a>` element
     */
  disabled: PropTypes.bool,

  /** Providing a `href` will render an `<a>` element, _styled_ as a button. */
  href: PropTypes.string,
  /**
     * Defines HTML button type attribute.
     *
     * @default 'button'
     */
  type: PropTypes.oneOf([ 'button', 'reset', 'submit', null ]),

  as: PropTypes.elementType,

  className: PropTypes.string,
};

const defaultProps = {
  variant: 'primary',
  active: false,
  disabled: false,
};

const Button = React.forwardRef(
  ({
    variant,
    size,
    active,
    inactive,
    className,
    block,
    gutterless,
    type,
    as,
    ...props
  }, ref) => {
    const classes = classNames(
      className,
      styles.btn,
      active && styles.active,
      inactive && styles.inactive,
      variant && styles[`btn-${variant}`],
      block && styles['btn-block'],
      size && styles[`btn-${size}`],
      gutterless && styles[`btn-gutterless`],
    );

    if (props.href) {
      return (<SafeAnchor {...props} as={as} ref={ref} className={classNames(classes, props.disabled && 'disabled')} />);
    }

    if (ref) {
      props.ref = ref;
    }

    if (type) {
      props.type = type;
    } else if (!as) {
      props.type = 'button';
    }

    const Component = as || 'button';
    return <Component {...props} className={classes} />;
  });

Button.displayName = 'Button';
Button.propTypes = propTypes;
Button.defaultProps = defaultProps;

Button.VARIANTS = VARIANTS;

Button.Classes = styles;
export default Button;
