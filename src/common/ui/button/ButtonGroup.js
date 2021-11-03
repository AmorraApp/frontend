import { cl as classNames } from 'common/utils';
import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import * as styles from './button.scss';

const propTypes = {

  /**
     * Sets the size for all Buttons in the group.
     *
     * @type ('sm'|'lg')
     */
  size: PropTypes.string,

  /** Make the set of Buttons appear vertically stacked. */
  vertical: PropTypes.bool,
  /**
     * Display as a button toggle group.
     *
     * (Generally it's better to use `ToggleButtonGroup` directly)
     */
  toggle: PropTypes.bool,
  /**
     * An ARIA role describing the button group. Usually the default
     * "group" role is fine. An `aria-label` or `aria-labelledby`
     * prop is also recommended.
     */
  role: PropTypes.string,
  as: PropTypes.elementType,
  className: PropTypes.string,
};

const defaultProps = {
  vertical: false,
  toggle: false,
  role: 'group',
};

const ButtonGroup = forwardRef((
  {
    size,
    toggle,
    vertical,
    className,
    as: Component = 'div',
    ...rest
  }, ref) => {

  const classes = classNames(
    className,
    vertical ? styles['btn-group-vertical'] : styles['btn-group'],
    size && styles[`btn-group-${size}`],
    toggle && styles[`btn-group-toggle`],
  );

  return (<Component {...rest} ref={ref} className={classes} />);
});

ButtonGroup.displayName = 'ButtonGroup';
ButtonGroup.propTypes = propTypes;
ButtonGroup.defaultProps = defaultProps;

export default ButtonGroup;
