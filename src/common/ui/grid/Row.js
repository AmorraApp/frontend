
import PropTypes from 'prop-types';
import divWithClassName from '../divWithClassName';
import styles from './grid.scss';
import { cl, isNotUndefinedOrNull } from 'common/utils';
import { forwardRef } from 'react';

const Row = forwardRef(({
  as: Component = 'div',
  className,
  children,
  flush,
  spaced,
  wrap,
  fill,
  'min-content': minContent,
  justify,
  align,
  style,
  width,
  height,
  ...props
}, ref) => {

  if (isNotUndefinedOrNull(width) || isNotUndefinedOrNull(width)) {
    style = {
      ...style,
      width,
      height,
    };
  }

  return (
    <Component
      ref={ref}
      className={cl(
        styles.row,
        fill && styles.fill,
        flush && styles.flush,
        spaced && styles.spaced,
        minContent && styles['min-content'],
        justify && styles['justify-' + justify],
        align && styles['align-' + align],
        wrap && styles.wrap,
        className,
      )}
      style={style}
      {...props}
    >{children}</Component>
  );
});

Row.displayName = 'Row';
Row.propTypes = {
  as: PropTypes.elementType,
  wrap: PropTypes.bool,
  fill: PropTypes.bool,
  flush: PropTypes.bool,
  spaced: PropTypes.bool,
  'min-content': PropTypes.bool,
  justify: PropTypes.oneOf([
    'left',
    'center',
    'right',
    'between',
    'around',
    'stretch',
  ]),
  align: PropTypes.oneOf([
    'top',
    'center',
    'bottom',
    'stretch',
  ]),
  className: PropTypes.string,
  children: PropTypes.oneOfType([ PropTypes.arrayOf(PropTypes.node), PropTypes.node ]),
  width: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  height: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
};

Row.Divider = divWithClassName(styles.vr, 'VerticalDivider', { children: <div className={styles.inner} /> });

export default Row;
