
import { cl, clRemap, r } from 'common/utils';
import { useCallback } from 'react';
import PropTypes from 'common/prop-types';
import styles from './datatable.scss';

const propTypes = {
  as: PropTypes.elementType,
  name: PropTypes.string,
  caption: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
  ]),
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
  ]),
  headerClass: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
  ]),
  headerStyle: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.func,
  ]),
  onClick: PropTypes.func.isRequired,
  active: PropTypes.bool,
  descending: PropTypes.bool,
};

const HeaderCell = ({
  as: Component = 'div',
  name,
  caption,
  title,
  headerStyle,
  headerClass,
  onClick,
  active,
  descending,
}) => {

  const handleClick = useCallback(() => onClick(name));

  return (
    <Component
      className={cl(
        styles.thead,
        active && styles.active,
        descending && styles.descending,
        r(headerClass),
      )}
      style={r(headerStyle)}
      title={r(title)}
      data-column-name={name}
      onClick={handleClick}
    >
      <span className={styles.wrapper}>
        <span className={cl(styles.inner, clRemap(r(headerClass), styles))}>{r(caption)}</span>
      </span>
      <span className={styles.arrow} />
    </Component>
  );
};
HeaderCell.displayName = 'DataTableHeaderCell';
HeaderCell.propTypes = propTypes;

export default HeaderCell;
