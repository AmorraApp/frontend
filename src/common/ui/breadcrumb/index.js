import { cl as classNames } from 'common/utils';
import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import * as styles from './breadcrumb.scss';
export { styles as Classes };

import BreadcrumbItem from './BreadcrumbItem';
const propTypes = {

  /**
   * ARIA label for the nav element
   * https://www.w3.org/TR/wai-aria-practices/#breadcrumb
   */
  label: PropTypes.string,

  /**
   * Additional props passed as-is to the underlying `<ol>` element
   */
  listProps: PropTypes.object,

  as: PropTypes.elementType,
};

const defaultProps = {
  label: 'breadcrumb',
  listProps: {},
};

const Breadcrumb = forwardRef(({
  className,
  listProps,
  children,
  label,
  as: Component = 'nav',
  ...props
}, ref) => (
  <Component aria-label={label} className={className} ref={ref} {...props}>
    <ol {...listProps} className={classNames(styles.breadcrumb, listProps && listProps.className)}>
      {children}
    </ol>
  </Component>
));
Breadcrumb.displayName = 'Breadcrumb';
Breadcrumb.propTypes = propTypes;
Breadcrumb.defaultProps = defaultProps;
Breadcrumb.Item = BreadcrumbItem;
Breadcrumb.Classes = styles;
export default Breadcrumb;
