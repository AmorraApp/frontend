import { cl as classNames } from 'common/utils';
import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import BaseToggle from './BaseToggle';
import styles from './input.scss';

const Disclosure = forwardRef(({
  className,
  left,
  right, // eslint-disable-line
  ...props
}, ref) => (
  <BaseToggle
    {...props}
    className={classNames(
      className,
      left && styles['custom-disclosure-left'],
    )}
    ref={ref}
    custom
    type="disclosure"
  />
));

Disclosure.propTypes = {
  left: PropTypes.bool,
  right: PropTypes.bool,
};
Disclosure.displayName = 'Disclosure';
export default Disclosure;
