import { cl as classNames } from 'common/utils';
import { isValidElement, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { mapChildren } from 'common/children';
import styles from './progress.scss';
const ROUND_PRECISION = 1000;

/**
 * Validate that children, if any, are instances of `<ProgressBar>`.
 */
function onlyProgressBar (props, propName, componentName) {
  const children = props[propName];
  if (!children) {
    return null;
  }
  let error = null;
  mapChildren(children, (child) => {
    if (error) {
      return;
    }
    /**
     * Compare types in a way that works with libraries that patch and proxy
     * components like react-hot-loader.
     *
     * see https://github.com/gaearon/react-hot-loader#checking-element-types
     */
    const element = <ProgressBar />;
    if (child.type === element.type) { return; }
    const childType = child.type;
    const childIdentifier = isValidElement(child)
      ? childType.displayName || childType.name || childType
      : child;
    error = new Error(`Children of ${componentName} can contain only ProgressBar ` +
            `components. Found ${childIdentifier}.`);
  });
  return error;
}

const VARIANTS = [
  'input', 'brand', 'primary', 'secondary', 'success', 'danger', 'warning', 'info', 'dark', 'light', 'link',
  'grade-a', 'grade-b', 'grade-c', 'grade-d', 'grade-f',
  'blue',
  'indigo',
  'purple',
  'pink',
  'red',
  'orange',
  'yellow',
  'green',
  'teal',
  'cyan',
  'white',
  'gray',
  'gray-dark',
];

const propTypes = {
  /**
   * Minimum value progress can begin from
   */
  min: PropTypes.number,

  /**
   * Current value of progress
   */
  now: PropTypes.number,

  /**
   * Maximum value progress can reach
   */
  max: PropTypes.number,

  /**
   * Show label that represents visual percentage.
   * EG. 60%
   */
  label: PropTypes.node,

  /**
   * Hide's the label visually.
   */
  srOnly: PropTypes.bool,

  /**
   * Uses a gradient to create a striped effect.
   */
  striped: PropTypes.bool,

  /**
   * Animate's the stripes from right to left
   */
  animated: PropTypes.bool,

  /**
   * Sets the background class of the progress bar.
   *
   * @type ('success'|'danger'|'warning'|'info')
   */
  variant: PropTypes.oneOf(VARIANTS),

  size: PropTypes.oneOf([ 'sm', 'lg' ]),

  /**
   * Child elements (only allows elements of type <ProgressBar />)
   */
  children: onlyProgressBar,

};

function getPercentage (now, min, max) {
  const percentage = ((now - min) / (max - min)) * 100;
  return Math.round(percentage * ROUND_PRECISION) / ROUND_PRECISION;
}

const Bar = forwardRef(({
  min = 0,
  now,
  max = 100,
  label,
  srOnly,
  striped,
  animated,
  className,
  style,
  variant,
  size,
  ...props
}, ref) => (
  <div
    ref={ref}
    {...props}
    role="progressbar"
    className={classNames(
      className,
      styles[`progress-bar`],
      variant && styles[`progress-${variant}`],
      animated && styles[`progress-bar-animated`],
      (animated || striped) && styles[`progress-bar-striped`],
      size && styles[`progress-bar-${size}`],
    )}
    style={{ width: `${getPercentage(now, min, max)}%`, ...style }}
    aria-valuenow={now}
    aria-valuemin={min}
    aria-valuemax={max}
  >
    {srOnly ? <span className="sr-only">{label}</span> : label}
  </div>
));
Bar.displayName = "ProgressBarInternal";
Bar.propTypes = propTypes;

const ProgressBar = forwardRef(({
  min,
  now,
  max,
  label,
  srOnly,
  striped,
  animated,
  variant,
  size,
  className,
  children,
  ...wrapperProps
}, ref) => {
  if (children) {
    children = mapChildren(children, (child, key) => (
      <Bar
        {...{ key, min, max, striped, animated, variant, size, ...child.props, ref: child.ref }}
      />
    ));
  } else {
    children = <Bar {...{ min, now, max, label, srOnly, striped, animated, variant, size }} />;
  }

  return (
    <div
      ref={ref}
      {...wrapperProps}
      className={classNames(
        className,
        styles.progress,
        size && styles[`progress-${size}`],
      )}
    >{children}</div>
  );
});
ProgressBar.displayName = 'ProgressBar';
ProgressBar.propTypes = propTypes;
ProgressBar.VARIANTS = VARIANTS;
export default ProgressBar;
