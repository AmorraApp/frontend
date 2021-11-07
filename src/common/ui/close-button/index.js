import PropTypes from 'prop-types';
import React from 'react';
import { cl as classNames } from 'common/utils';
import styles from './closebutton.scss';

const VARIANTS = [
  'primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark',
  'grade-a', 'grade-b', 'grade-c', 'grade-d', 'grade-f', 'outline',
];

const propTypes = {
  /** @default button */
  as: PropTypes.elementType,

  label: PropTypes.string,
  onClick: PropTypes.func,
  className: PropTypes.string,

  /**
     * The visual style of the badge
     *
     * @type {('primary'|'secondary'|'success'|'danger'|'warning'|'info'|'light'|'dark')}
     */
  variant: PropTypes.oneOf(VARIANTS),

  /**
     * Specifies a large or small button.
     *
     * @type ('sm'|'lg')
     */
  size: PropTypes.oneOf([ 'xs', 'sm', 'lg', 'xl' ]),

};

const defaultProps = {
  label: 'Close',
};

const CloseButton = React.forwardRef(({
  as: Component = 'button',
  label,
  className,
  variant,
  size,
  ...props
}, ref) => (
  <Component
    ref={ref}
    type="button"
    className={classNames(
      styles.close,
      className,
      variant && styles['close-' + variant],
      size && styles[`close-${size}`],
    )}
    {...props}
  >
    <span aria-hidden="true">&times;</span>
    <span className={styles['sr-only']}>{label}</span>
  </Component>
));

CloseButton.displayName = 'CloseButton';
CloseButton.propTypes = propTypes;
CloseButton.defaultProps = defaultProps;
CloseButton.VARIANTS = VARIANTS;
export default CloseButton;

export {
  styles as Classes,
};
