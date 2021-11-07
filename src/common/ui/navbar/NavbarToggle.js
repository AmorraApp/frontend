import { cl as classNames } from 'common/utils';
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import useEventCallback from 'common/hooks/useEventCallback';
import NavbarContext from './NavbarContext';
import styles from './navbar.scss';

const propTypes = {
  /** @default 'navbar-toggler' */
  bsPrefix: PropTypes.string,
  /** An accessible ARIA label for the toggler button. */
  label: PropTypes.string,
  /** @private */
  onClick: PropTypes.func,
  /**
     * The toggle content. When empty, the default toggle will be rendered.
     */
  children: PropTypes.node,
  as: PropTypes.elementType,
};

const defaultProps = {
  label: 'Toggle navigation',
};

const NavbarToggle = React.forwardRef(({
  className,
  children,
  label,
  as: Component = 'button',
  onClick,
  ...props
}, ref) => {

  const { onToggle, expanded } = useContext(NavbarContext) || {};
  const handleClick = useEventCallback((e) => {
    if (onClick) { onClick(e); }
    if (onToggle) { onToggle(); }
  });
  if (Component === 'button') {
    props.type = 'button';
  }
  return (
    <Component
      {...props}
      ref={ref}
      onClick={handleClick}
      aria-label={label}
      className={classNames(
        className,
        styles['navbar-toggler'],
        !expanded && styles.collapsed,
      )}
    >{children || <span className={styles['navbar-toggler-icon']} />}</Component>
  );
});
NavbarToggle.displayName = 'NavbarToggle';
NavbarToggle.propTypes = propTypes;
NavbarToggle.defaultProps = defaultProps;
export default NavbarToggle;
