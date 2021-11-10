import PropTypes from 'prop-types';
import React from 'react';
import { cl as classNames } from 'common/utils';
import styles from './closebutton.scss';
import VARIANTS from 'common/ui/variants';

const propTypes = {
  /** @default button */
  as: PropTypes.elementType,

  label: PropTypes.string,
  onClick: PropTypes.func,
  className: PropTypes.string,

  'aria-label': PropTypes.string,

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
  'aria-label': ariaLabel = 'Close',
  className,
  variant,
  size,
  ...props
}, ref) => (
  <Component
    {...props}
    ref={ref}
    type="button"
    className={classNames(
      styles['btn-close'],
      className,
      variant && styles['btn-close-' + variant],
      size && styles[`btn-close-${size}`],
    )}
    aria-label={ariaLabel}
  />
));

CloseButton.displayName = 'CloseButton';
CloseButton.propTypes = propTypes;
CloseButton.defaultProps = defaultProps;
CloseButton.VARIANTS = VARIANTS;
export default CloseButton;

export {
  styles as Classes,
};
