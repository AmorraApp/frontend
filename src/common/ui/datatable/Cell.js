
import PropTypes from 'common/prop-types';

const DataTableCell = () => {
  throw new Error('DataTableCell is an abstract component and should not have actually been rendered.');
};

DataTableCell.displayName = 'DataTableCell';
DataTableCell.propTypes = {
  name: PropTypes.string,
  caption: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
  ]).isRequired,
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
  ]),
  width: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  href: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
  ]),
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
  ]),
  headerClass: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
  ]),
  style: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.func,
  ]),
  headerStyle: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.func,
  ]),
  sortValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
    PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.func,
    ])),
  ]),
  defaultSort: PropTypes.bool,
  children: PropTypes.func.isRequired,
};

export default DataTableCell;
