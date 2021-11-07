import { cl as classNames } from 'common/utils';
import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import styles from './googlemap.scss';

const propTypes = {
  className: PropTypes.string,
  as: PropTypes.elementType,
};

const MapOverlay = forwardRef(({
  className,
  as: Component = 'div',
  ...props
}, ref) => (
  <Component
    ref={ref}
    className={classNames(
      styles.overlay,
      className,
    )}
    {...props}
  />
));
MapOverlay.displayName = 'MapOverlay';
MapOverlay.propTypes = propTypes;

export default MapOverlay;
