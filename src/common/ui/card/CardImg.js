import { cl as classNames } from 'common/utils';
import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import styles from './card.scss';

const propTypes = {
  className: PropTypes.string,
  /**
     * Defines image position inside
     * the card.
     *
     * @type {('top'|'bottom')}
     */
  variant: PropTypes.oneOf([ 'top', 'bottom', null ]),

  as: PropTypes.elementType,
};

const defaultProps = {
  variant: null,
};

const CardImg = forwardRef(({
  className,
  variant,
  as: Component = 'img',
  ...props
}, ref) => (
  <Component
    ref={ref}
    className={classNames(
      variant ? styles[`card-img-${variant}`] : styles['card-img'],
      className,
    )}
    {...props}
  />
));
CardImg.displayName = 'CardImg';
CardImg.propTypes = propTypes;
CardImg.defaultProps = defaultProps;

export default CardImg;
