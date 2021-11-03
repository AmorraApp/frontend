import PropTypes from 'prop-types';
import { cl } from 'common/utils';
import { forwardRef } from 'react';
import * as styles from './badge.scss';
import CloseButton from '../close-button';

const VARIANTS = [
  'primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark',
  'grade-a', 'grade-b', 'grade-c', 'grade-d', 'grade-f',
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

  /**
   * Style the badge as a button
   */
  button: PropTypes.bool,

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
  size,
  variant = 'primary',
  button,
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
      pill && styles.pill,
      variant && styles['badge-' + variant],
      size && styles[`badge-${size}`],
      disabled && styles.disabled,
      button && styles['badge-btn'],
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
