import PropTypes from 'prop-types';
import { cl as classNames } from 'common/utils';
import { forwardRef, Children } from 'react';
import * as styles from './spinner.scss';

const VARIANTS = [ 'primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark' ];
const ANIMATIONS = [ 'rotate', 'border', 'grow', 'blades', 'ellipsis' ];

const propTypes = {

  /**
     * The visual color style of the spinner
     *
     * @type {('primary'|'secondary'|'success'|'danger'|'warning'|'info'|'light'|'dark')}
     */
  variant: PropTypes.oneOf(VARIANTS),

  /**
     * Changes the animation style of the spinner.
     *
     * @type {('border'|'grow')}
     * @default true
     */
  animation: PropTypes.oneOf(ANIMATIONS),

  /**
     * Component size variations.
     *
     * @type {('sm')}
     */
  size: PropTypes.oneOf([ 'sm', 'lg', 'xl' ]),

  /**
     * This component may be used to wrap child elements or components.
     */
  children: PropTypes.element,

  /**
     * An ARIA accessible role applied to the Menu component. This should generally be set to 'status'
     */
  role: PropTypes.string,

  /**
     * @default div
     */
  as: PropTypes.elementType,
};


const Spinner = forwardRef(({
  variant,
  animation,
  size,
  as: Component = 'div',
  className,
  ...props
}, ref) => {

  if (!animation) animation = Children.count(props.children) ? 'rotate' : 'blades';

  if (animation === 'blades') {
    props.children = [ ...Array(12) ].map((_, index) => (
      <div key={index} />
    ));
  }

  if (animation === 'ellipsis') {
    props.children = [ ...Array(4) ].map((_, index) => (
      <div key={index} />
    ));
  }

  return (
    <Component
      ref={ref}
      {...props}
      className={classNames(
        className,
        styles.spinner,
        styles[`spinner-${animation}`],
        size && styles[`spinner-${animation}-${size}`],
        variant && styles[`spinner-${variant}`],
      )}
    />
  );
});
Spinner.propTypes = propTypes;
Spinner.displayName = 'Spinner';
Spinner.ANIMATIONS = ANIMATIONS;
Spinner.VARIANTS = VARIANTS;
export default Spinner;
