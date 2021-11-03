

import PropTypes from 'common/prop-types';
import BodyCell from './BodyCell';

const propTypes = {
  columns: PropTypes.arrayOf(PropTypes.object),
  row: PropTypes.object,
  rowKey: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  onHover: PropTypes.func,
  onRowClick: PropTypes.func,
  selected: PropTypes.bool,
  hovered: PropTypes.bool,
  firstRow: PropTypes.bool,
  lastRow: PropTypes.bool,
};

const Row = ({
  columns,
  row,
  rowKey,
  onHover,
  onRowClick,
  selected,
  hovered,
  firstRow,
  lastRow,
}) => {
  const lastColumnIndex = columns.length - 1;
  return (
    <>
      {columns.map((column, columnIndex) => (
        <BodyCell
          {...column}
          column={column}
          row={row}
          rowKey={rowKey}
          key={rowKey + '.' + column.id}
          onRowClick={onRowClick}
          onHover={onHover}
          selected={selected}
          hovered={hovered}
          firstRow={firstRow}
          lastRow={lastRow}
          firstColumn={columnIndex === 0}
          lastColumn={columnIndex === lastColumnIndex}
        />
      ))}
    </>
  );
};
Row.displayName = 'DataTableRow';
Row.propTypes = propTypes;

export default Row;
