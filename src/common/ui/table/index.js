import { cl as classNames } from 'common/utils';
import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import * as styles from './table.scss';
export { styles as Classes };

const propTypes = {
  /**
     * Adds zebra-striping to any table row within the `<tbody>`.
     */
  striped: PropTypes.bool,

  /**
     * Adds borders on all sides of the table and cells.
     */
  bordered: PropTypes.bool,

  /**
     * Removes all borders on the table and cells, including table header.
     */
  borderless: PropTypes.bool,

  /**
     * Enable a hover state on table rows within a `<tbody>`.
     */
  hover: PropTypes.bool,

  /**
     * Make tables more compact by cutting cell padding in half by setting
     * size as `sm`.
     */
  size: PropTypes.string,

  /**
     * Invert the colors of the table — with light text on dark backgrounds
     * by setting variant as `dark`.
     */
  variant: PropTypes.string,

  /**
     * Responsive tables allow tables to be scrolled horizontally with ease.
     * Across every breakpoint, use `responsive` for horizontally
     * scrolling tables. Responsive tables are wrapped automatically in a `div`.
     * Use `responsive="sm"`, `responsive="md"`, `responsive="lg"`, or
     * `responsive="xl"` as needed to create responsive tables up to
     * a particular breakpoint. From that breakpoint and up, the table will
     * behave normally and not scroll horizontally.
     */
  responsive: PropTypes.oneOfType([ PropTypes.bool, PropTypes.string ]),
};

const Table = forwardRef(({
  className,
  striped,
  bordered,
  borderless,
  hover,
  size,
  variant,
  responsive,
  ...props
}, ref) => {

  const classes = classNames(
    className,
    styles.table,
    variant && styles[`table-${variant}`],
    size && styles[`table-${size}`],
    striped && styles[`table-striped`],
    bordered && styles[`table-bordered`],
    borderless && styles[`table-borderless`],
    hover && styles[`table-hover`],
  );

  const table = <table {...props} className={classes} ref={ref} />;
  if (responsive) {
    let responsiveClass = styles[`table-responsive`];
    if (typeof responsive === 'string') {
      responsiveClass = `${responsiveClass}-${responsive}`;
    }
    return <div className={responsiveClass}>{table}</div>;
  }
  return table;
});

Table.propTypes = propTypes;
export default Table;
