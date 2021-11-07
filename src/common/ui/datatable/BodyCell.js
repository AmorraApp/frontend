
import { cl, clRemap, r } from 'common/utils';
import { useCallback } from 'common/hooks';
import PropTypes from 'common/prop-types';
import styles from './datatable.scss';
import SafeAnchor from 'common/ui/safe-anchor';

const propTypes = {
  as: PropTypes.elementType,
  name: PropTypes.string,
  render: PropTypes.func,
  href: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
  ]),
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
  ]),
  style: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.func,
  ]),
  onColumnClick: PropTypes.func,
  onRowClick: PropTypes.func.isRequired,
  onHover: PropTypes.func,
  activeColumn: PropTypes.bool,
  selected: PropTypes.bool,
  hovered: PropTypes.bool,
  row: PropTypes.object.isRequired,
  rowKey: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  firstRow: PropTypes.bool,
  lastRow: PropTypes.bool,
  firstColumn: PropTypes.bool,
  lastColumn: PropTypes.bool,
  column: PropTypes.object.isRequired,
};

const BodyCell = ({
  as: Component = 'div',
  name,
  render,
  href,
  style,
  className,
  onColumnClick,
  onRowClick,
  onHover,
  activeColumn,
  selected,
  hovered,
  row,
  rowKey,
  firstRow,
  lastRow,
  firstColumn,
  lastColumn,
  column,
}) => {

  href = r(href, row);
  if (href) Component = SafeAnchor;
  else href = undefined;

  const handleClick = useCallback((ev) => {
    onColumnClick && onColumnClick(ev, row, column);
    if (ev.defaultPrevented) return;
    onRowClick && onRowClick({ ev, row, rowKey, name });
  });

  const onMouseEnter = useCallback(() => onHover && onHover(rowKey, name), [ rowKey, name, onHover ]);
  const onMouseLeave = useCallback(() => onHover && onHover(), [ onHover ]);

  return (
    <Component
      href={href}
      className={cl(
        styles.tbody,
        activeColumn && styles.active,
        selected && styles.selected,
        hovered && styles.hover,
        firstRow && styles.firstRow,
        lastRow && styles.lastRow,
        firstColumn && styles.firstColumn,
        lastColumn && styles.lastColumn,
      )}
      style={r(style, row, column)}
      data-column-name={name}
      data-row-key={rowKey}
      onClick={handleClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <span className={styles.wrapper}>
        <span className={cl(styles.inner, clRemap(r(className, row, column), styles))}>{render(row, column)}</span>
      </span>
    </Component>
  );
};
BodyCell.displayName = 'DataTableBodyCell';
BodyCell.propTypes = propTypes;

export default BodyCell;
