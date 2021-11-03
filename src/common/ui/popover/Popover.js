import { cl as classNames } from 'common/utils';
import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';
import * as styles from './popover.scss';

const propTypes = {

  /**
     * An html id attribute, necessary for accessibility
     * @type {string|number}
     * @required
     */
  id: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
  /**
     * Sets the direction the Popover is positioned towards.
     *
     * > This is generally provided by the `Overlay` component positioning the popover
     */
  placement: PropTypes.oneOf([ 'auto', 'top', 'bottom', 'left', 'right' ]),
  /**
     * An Overlay injected set of props for positioning the popover arrow.
     *
     * > This is generally provided by the `Overlay` component positioning the popover
     */
  arrowProps: PropTypes.shape({
    ref: PropTypes.any,
    style: PropTypes.object,
  }),
  /**
     * When this prop is set, it creates a Popover with a Popover.Content inside
     * passing the children directly to it
     */
  content: PropTypes.bool,
  /** @private */
  popper: PropTypes.object,
  /** @private */
  show: PropTypes.bool,
};

const defaultProps = {
  placement: 'right',
};

const Popover = forwardRef(({
  id = 'popover-' + uuid().replace(/[^a-z0-9]/g, '').substr(-8),
  placement,
  className,
  style,
  children,
  arrowProps,
  popper, // eslint-disable-line
  show, // eslint-disable-line
  ...props
}, ref) => {
  const [ primaryPlacement ] = placement?.split('-') || [];
  return (
    <div
      id={id}
      ref={ref}
      role="tooltip"
      style={style}
      x-placement={primaryPlacement}
      className={classNames(
        className,
        styles.popover,
        primaryPlacement && styles[`popover-${primaryPlacement}`],
      )}
      {...props}
    >
      <div className={styles.arrow} {...arrowProps} />
      {children}
    </div>
  );
});
Popover.displayName = 'Popover';
Popover.propTypes = propTypes;
Popover.defaultProps = defaultProps;

export default Popover;
