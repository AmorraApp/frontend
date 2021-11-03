import { cl as classNames } from 'common/utils';
import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { useUncontrolled } from 'uncontrollable';
import AbstractNav from '../nav/AbstractNav';
import ListGroupItem from './ListGroupItem';
import * as styles from './listgroup.scss';
export { styles as Classes };

const propTypes = {
  /**
     * Adds a variant to the list-group
     *
     * @type {('flush')}
     */
  variant: PropTypes.oneOf([ 'flush', undefined ]),

  /**
     * Changes the flow of the list group items from vertical to horizontal.
     * A value of `null` (the default) sets it to vertical for all breakpoints;
     * Just including the prop sets it for all breakpoints, while `{sm|md|lg|xl}`
     * makes the list group horizontal starting at that breakpoint’s `min-width`.
     * @type {(true|'sm'|'md'|'lg'|'xl')}
     */
  horizontal: PropTypes.oneOf([ true, 'sm', 'md', 'lg', 'xl', undefined ]),

  /**
     * You can use a custom element type for this component.
     */
  as: PropTypes.elementType,
};

const defaultProps = {
  variant: undefined,
  horizontal: undefined,
};

const ListGroup = forwardRef((props, ref) => {
  const {
    className,
    variant,
    horizontal,
    as = 'div',
    ...controlledProps
  } = useUncontrolled(props, {
    activeKey: 'onSelect',
  });

  return (
    <AbstractNav
      ref={ref}
      {...controlledProps}
      as={as}
      className={classNames(
        className,
        styles['list-group'],
        variant && styles[`list-group-${variant}`],
        horizontal && styles[(horizontal === true) ? 'horizontal' : `horizontal-${horizontal}`],
      )}
    />
  );
});
ListGroup.propTypes = propTypes;
ListGroup.defaultProps = defaultProps;
ListGroup.displayName = 'ListGroup';
ListGroup.Item = ListGroupItem;
export default ListGroup;
