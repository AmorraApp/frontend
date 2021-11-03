
import PropTypes from 'common/prop-types';
import { cl, isString, isNumber, isFunction, map, keyBy, sort, find, get } from 'common/utils';
import { forwardRef, useState, useCallback, useMemo } from 'react';
import { mapChildren } from 'common/children';
import * as styles from './datatable.scss';
import useDerivedState from 'common/hooks/useDerivedState';
import useChildren from 'common/hooks/useChildren';
import DataCell from './Cell';
import HeaderCell from './HeaderCell';
import Row from './Row';

function rowKey (rowKeyBy, row, rowIndex) {
  if (!rowKeyBy) return rowIndex;
  if (isFunction(rowKeyBy)) return rowKeyBy(row, rowIndex);
  if (isString(rowKeyBy)) return get(row, rowKeyBy);
  return rowIndex;
}

const propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  onRowClick: PropTypes.func,
  rowKeyBy: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
  ]),
};

const DataTable = forwardRef(({
  className,
  data,
  rowKeyBy,
  children,
  onRowClick,
  ...props
}, ref) => {

  const columnEntries = useChildren(children, () =>
    mapChildren(children, (child, i) => {
      if (child.type.displayName !== 'DataTableCell') return null;

      const id = child.key;
      const {
        name,
        caption,
        title,
        width,
        onClick: onColumnClick,
        children: render,
        ...childProps
      } = child.props;

      return {
        ...childProps,
        id,
        name: name || id,
        caption: caption || name || 'Column ' + (i + 1),
        title: title || caption,
        width: width && (isNumber(width) ? `${width}fr` : width) || '1fr',
        onColumnClick,
        orderIndex: i,
        render,
      };

    }),
  );

  const columnsByName = useMemo(() => keyBy(columnEntries, 'name'), columnEntries);
  const columnsSorted = sort(columnEntries, 'orderIndex');

  const classes = cl(
    className,
    styles.datatable,
  );

  const gridStyle = {
    gridTemplateColumns: map(columnsSorted, 'width').join(' '),
  };

  const [ [ sortingColumn, descending ], setSortingColumn, getSortingColumn ] = useDerivedState(() => {
    const defaultSort = find(columnEntries, 'defaultSort') || columnsSorted[0];
    return [ defaultSort, defaultSort.descending || false ];
  }, [ columnEntries ]);
  const [ selectedRow, setSelectedRow ] = useState(null);
  const [ hoveredRow, setHoveredRow ] = useState(null);

  const handleRowClick = useCallback(({ ev, row, rowIndex, name: columnName }) => {
    onRowClick && onRowClick(ev, row, columnName);
    if (ev.defaultPrevented) return;
    setSelectedRow(rowIndex);
  }, [ onRowClick, setSelectedRow ]);

  const handleRowHover = useCallback((rowIndex) => {
    setHoveredRow(rowIndex);
  }, [ setHoveredRow ]);

  const handleColumnClick = useCallback((name) => {
    const [ currentColumn, currentDescendng ] = getSortingColumn();
    if (currentColumn?.name === name) {
      setSortingColumn([ currentColumn, !currentDescendng ]);
      return;
    }

    const column = columnsByName[name];
    column && setSortingColumn([ column, column.descending || false ]);
  }, [ getSortingColumn, setSortingColumn, ...columnEntries ]);

  const sortedData = useMemo(() => {
    const rows = sortingColumn.sortValue
      ? sort(data, sortingColumn.sortValue)
      : data
    ;
    if (descending) return rows.reverse();
    return rows;
  }, [ sortingColumn, descending ]);

  const totalRows = sortedData.length;



  return (
    <div {...props} className={classes} ref={ref}>
      <div className={styles.table} style={gridStyle}>
        {columnsSorted.map((column) => (
          <HeaderCell
            {...column}
            key={column.id}
            active={column === sortingColumn}
            descending={descending}
            onClick={handleColumnClick}
          />
        ))}
        {sortedData.map((row, rowIndex) => {
          const k = rowKey(rowKeyBy, row, rowIndex);
          return (
            <Row
              key={k}
              columns={columnsSorted}
              row={row}
              rowKey={k}
              onRowClick={handleRowClick}
              onHover={handleRowHover}
              activeColumn={false}
              selected={k === selectedRow}
              hovered={k === hoveredRow}
              firstRow={rowIndex === 0}
              lastRow={rowIndex === totalRows - 1}
            />
          );
        })}
      </div>
    </div>
  );
});
DataTable.displayName = 'DataTable';
DataTable.propTypes = propTypes;
DataTable.Cell = DataCell;

export default DataTable;
