import PropTypes from 'prop-types';
import styles from './button.scss';
import divWithClassName from '../divWithClassName';

const propTypes = {

  className: PropTypes.string,

  /**
     * The ARIA role describing the button toolbar. Generally the default
     * "toolbar" role is correct. An `aria-label` or `aria-labelledby`
     * prop is also recommended.
     */
  role: PropTypes.string,

  /** @default span */
  as: PropTypes.elementType,
};

const defaultProps = {
  role: 'toolbar',
};

const ButtonToolbar = divWithClassName(styles['btn-toolbar']);
ButtonToolbar.displayName = 'ButtonToolbar';
ButtonToolbar.propTypes = propTypes;
ButtonToolbar.defaultProps = defaultProps;
export default ButtonToolbar;
