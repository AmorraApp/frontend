
import PropTypes from 'prop-types';
import * as styles from './cell.scss';
import { cl } from 'common/utils';
import { forwardRef } from 'react';

const Cell = forwardRef(
  ({ as: Component = 'div', className, ...props }, ref) => (
    <Component
      ref={ref}
      className={cl(
        className,
        styles.cell,
      )}
      {...props}
    />
  ),
);

Cell.displayName = 'Cell';
Cell.propTypes = {
  as: PropTypes.elementType,
  className: PropTypes.string,
};

export default Cell;
