
import PropTypes from 'prop-types';
import divWithClassName from '../divWithClassName';
import * as styles from './grid.scss';
import { cl, isNotUndefinedOrNull } from 'common/utils';
import { forwardRef } from 'react';

const Column = forwardRef(({
  as: Component = 'div',
  fill,
  justify,
  spaced,
  align,
  scrollable,
  'min-content': minContent,
  className,
  children,
  width,
  height,
  style,
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
        className,
        styles.column,
        spaced && styles.spaced,
        fill && styles.fill,
        minContent && styles['min-content'],
        scrollable && styles.scrollable,
        justify && styles['justify-' + justify],
        align && styles['align-' + align],
      )}
      style={style}
      {...props}
    >{children}</Component>
  );
});

Column.displayName = 'Column';
Column.propTypes = {
  as: PropTypes.elementType,
  className: PropTypes.string,
  fill: PropTypes.bool,
  spaced: PropTypes.bool,
  scrollable: PropTypes.bool,
  children: PropTypes.oneOfType([ PropTypes.arrayOf(PropTypes.node), PropTypes.node ]),
  'min-content': PropTypes.bool,
  align: PropTypes.oneOf([
    'top',
    'center',
    'bottom',
    'between',
    'around',
    'stretch',
  ]),
  justify: PropTypes.oneOf([
    'left',
    'center',
    'right',
    'stretch',
  ]),
  width: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  height: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
};

Column.Divider = divWithClassName(styles.hr, 'HorizontalDivider', { children: <div className={styles.inner} /> });

export default Column;
