import PropTypes from 'prop-types';
import { cl } from 'common/utils';
import { forwardRef } from 'react';
import styles from './badge.scss';
import CloseButton from '../close-button';
import utilities from 'common/ui/utility.scss';

const VARIANTS = [
  'primary', 'secondary', 'success', 'danger', 'warning', 'info', 'brand', 'accent',
];

const propTypes = {

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
  size: PropTypes.oneOf([ 'sm', 'lg' ]),

  /**
   * Add the `pill` modifier to make badges more rounded with
   * some additional horizontal padding
   */
  pill: PropTypes.bool,

  /** @default span */
  as: PropTypes.elementType,

  className: PropTypes.string,

  children: PropTypes.oneOfType([ PropTypes.arrayOf(PropTypes.node), PropTypes.node ]),

  /**
   * Badge close button will only draw if an onClose function is provided or closable is true
   */
  onClose: PropTypes.func,

  closable: PropTypes.bool,

  disabled: PropTypes.bool,
};

const defaultProps = {
  pill: false,
};

const Badge = forwardRef(({
  as: Component = 'span',
  pill,
  className,
  variant = 'secondary',
  onClose,
  closable,
  children,
  disabled,
  ...props
}, ref) => (
  <Component
    ref={ref}
    className={cl(
      styles.badge,
      pill && utilities['rounded-pill'],
      variant && utilities['bg-' + variant],
      disabled && styles.disabled,
      className,
    )}
    {...props}
  >
    {children}
    {(onClose || closable || null) && <CloseButton disabled={disabled} className={styles.close} onClick={onClose} tabIndex={-1} />}
  </Component>
));

Badge.displayName = 'Badge';
Badge.propTypes = propTypes;
Badge.defaultProps = defaultProps;
Badge.VARIANTS = VARIANTS;
export default Badge;
