import { cl as classNames } from 'common/utils';
import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import * as styles from './listgroup.scss';

import AbstractNavItem from '../nav/AbstractNavItem';

const propTypes = {
  /**
     * Sets contextual classes for list item
     * @type {('primary'|'secondary'|'success'|'danger'|'warning'|'info'|'dark'|'light')}
     */
  variant: PropTypes.string,
  /**
     * Marks a ListGroupItem as actionable, applying additional hover, active and disabled styles
     * for links and buttons.
     */
  action: PropTypes.bool,
  /**
     * Sets list item as active
     */
  active: PropTypes.bool,
  /**
     * Sets list item state as disabled
     */
  disabled: PropTypes.bool,
  eventKey: PropTypes.string,
  onClick: PropTypes.func,
  href: PropTypes.string,
  /**
     * You can use a custom element type for this component. For none `action` items, items render as `li`.
     * For actions the default is an achor or button element depending on whether a `href` is provided.
     *
     * @default {'div' | 'a' | 'button'}
     */
  as: PropTypes.elementType,
};

const defaultProps = {
  variant: undefined,
  active: false,
  disabled: false,
};

const ListGroupItem = React.forwardRef(({
  active,
  disabled,
  className,
  variant,
  action,
  as,
  eventKey,
  onClick,
  ...props
}, ref) => {

  const handleClick = useCallback((event) => {
    if (disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    if (onClick) { onClick(event); }
  }, [ disabled, onClick ]);

  let comp = 'div';
  if (action) comp = (props.href ? 'a' : 'button');

  return (
    <AbstractNavItem
      ref={ref} {...props}
      eventKey={eventKey || props.href}
      as={as || comp}
      onClick={handleClick}
      className={classNames(
        className,
        styles['list-group-item'],
        active && styles.active,
        disabled && styles.disabled,
        variant && styles[`list-group-item-${variant}`],
        action && styles['list-group-item-action'],
      )}
    />
  );
});
ListGroupItem.propTypes = propTypes;
ListGroupItem.defaultProps = defaultProps;
ListGroupItem.displayName = 'ListGroupItem';
export default ListGroupItem;
