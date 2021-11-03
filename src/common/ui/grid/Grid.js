
import PropTypes from 'prop-types';
import { cl, isArray, isNumber, isObject } from 'common/utils';
import * as styles from './grid.scss';
import { forwardRef } from 'react';
import { mapChildren } from 'common/children';

function position (column, size = 'sm', type = 'column') {
  if (isObject(column)) {
    column = { column: 1, size: 'sm', type: 'column', ...column };
    type = column.type;
    size = column.size;
    column = column.column;
  }
  const selector = `grid-${type}-${size}-${column}`;
  return styles[selector];
}

function span (column, size = 'sm', type = 'column') {
  if (isObject(column)) {
    column = { column: 1, size: 'sm', type: 'column', ...column };
    type = column.type;
    size = column.size;
    column = column.column;
  }
  const selector = `grid-${type}-span-${size}-${column}`;
  return styles[selector];
}

const Grid = forwardRef(({
  as: Component = 'div',
  columns = 12,
  rows,
  rowSpacing,
  colSpacing,
  style,
  className,
  spaced,
  width,
  height,
  wrapCells,
  ...props
}, ref) => {
  if (isNumber(columns)) columns = [ ...Array(columns) ].map(() => '1fr').join(' ');
  else if (isArray(columns)) columns = columns.map((v) => (isNumber(v) ? v + 'fr' : v)).join(' ');
  else if (!columns) columns = undefined;

  if (isNumber(rows)) rows = [ ...Array(rows) ].map(() => '1fr').join(' ');
  else if (isArray(rows)) rows = rows.map((v) => (isNumber(v) ? v + 'fr' : v)).join(' ');
  else if (!rows) rows = undefined;

  // This is to address an annoying issue in safari because it follows the spec
  // instead of what just makes sense
  if (wrapCells) props.children = mapChildren(props.children, (child) => <div key={child.key} className={styles.wrap}>{child}</div>);

  return (
    <Component
      ref={ref}
      className={cl(
        className,
        styles.grid,
        spaced && styles.spaced,
      )}
      style={{
        gridTemplateColumns: columns,
        gridTemplateRows: rows,
        gridColumnGap: colSpacing,
        gridRowGap: rowSpacing,
        width,
        height,
        ...style,
      }}
      {...props}
    />
  );
});
Grid.propTypes = {
  as: PropTypes.elementType,
  className: PropTypes.string,
  columns: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ])),
  ]),
  rows: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ])),
  ]),
  colSpacing: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  rowSpacing: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  width: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  height: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  spaced: PropTypes.bool,
  wrapCells: PropTypes.bool,
};

Grid.fill = styles.fill;
Grid.full = styles.full;

Grid.cell = ({ col, row, colSpan, rowSpan, size = 'sm' }) => [
  col && position(col, size, 'column'),
  colSpan && span(colSpan, size, col),
  row && position(row, size, 'row'),
  rowSpan && span(rowSpan, size, row),
].filter(Boolean).join(' ');

Grid.Spacer = () => <div className={styles.spacer} />;
Grid.Spacer.displayName = 'Grid.Spacer';

export default Grid;
