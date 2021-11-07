
import { cl as classNames } from 'common/utils';
import PropTypes from 'prop-types';
import { forwardRef, Children } from 'react';
import styles from './disclosure.scss';
import AngleLeft from 'common/svgs/solid/angle-left.svg';
import AngleRight from 'common/svgs/solid/angle-right.svg';

const Disclosure = forwardRef(({
  as: Component = 'span',
  className,
  active,
  rotation = 'right',
  distance = 'quarter',
  children,
  ...props
}, ref) => {

  if (!Children.count(children)) {
    switch (rotation) {
    case 'left':
      children = <AngleLeft />;
      break;
    case 'right':
      children = <AngleRight />;
      break;
    // no default
    }
  } else {
    children = Children.only(children);
  }

  return (
    <Component
      {...props}
      className={classNames(
        className,
        styles.disclosure,
        styles[rotation],
        styles[distance],
        active && styles.active,
      )}
      ref={ref}
    >{children}</Component>
  );
});

Disclosure.propTypes = {
  as: PropTypes.elementType,
  rotation: PropTypes.oneOf([ 'left', 'right' ]),
  distance: PropTypes.oneOf([ 'quarter', 'half', 'full' ]),
  active: PropTypes.bool,
};
Disclosure.displayName = 'Disclosure';
export default Disclosure;
