import { cl as classNames } from 'common/utils';
import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { isRequiredForA11y } from 'common/prop-types';
import styles from './tooltip.scss';
export { styles as Classes };

const propTypes = {

  /**
     * An html id attribute, necessary for accessibility
     * @type {string|number}
     * @required
     */
  id: isRequiredForA11y(
    PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
  ),
  /**
     * Sets the direction the Tooltip is positioned towards.
     *
     * > This is generally provided by the `Overlay` component positioning the tooltip
     */
  placement: PropTypes.oneOf([
    'auto-start',
    'auto',
    'auto-end',
    'top-start',
    'top',
    'top-end',
    'right-start',
    'right',
    'right-end',
    'bottom-end',
    'bottom',
    'bottom-start',
    'left-end',
    'left',
    'left-start',
  ]),
  /**
     * An Overlay injected set of props for positioning the tooltip arrow.
     *
     * > This is generally provided by the `Overlay` component positioning the tooltip
     *
     * @type {{ ref: ReactRef, style: Object }}
     */
  arrowProps: PropTypes.shape({
    ref: PropTypes.any,
    style: PropTypes.object,
  }),

  /** @private */
  popper: PropTypes.object,
  /** @private */
  show: PropTypes.any,
};

const defaultProps = {
  placement: 'right',
};

const Tooltip = forwardRef(({
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
      ref={ref}
      style={style}
      role="tooltip"
      x-placement={primaryPlacement}
      className={classNames(
        className,
        styles.tooltip,
        styles[`bs-tooltip-${primaryPlacement}`],
      )}
      {...props}
    >
      <div className="arrow" {...arrowProps} />
      <div className={styles[`tooltip-inner`]}>{children}</div>
    </div>
  );
});

Tooltip.propTypes = propTypes;
Tooltip.defaultProps = defaultProps;
Tooltip.displayName = 'Tooltip';
export default Tooltip;
