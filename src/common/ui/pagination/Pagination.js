import { cl as classNames } from 'common/utils';
import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import styles from './pagination.scss';

const propTypes = {
  /**
     * Set's the size of all PageItems.
     *
     * @type {('sm'|'lg')}
     */
  size: PropTypes.string,
};

const Pagination = forwardRef(({
  className,
  size,
  ...props
}, ref) => (
  <ul ref={ref} {...props} className={classNames(className, styles.pagination, size && styles[`pagination-${size}`])} />
));
Pagination.propTypes = propTypes;

export default Pagination;
