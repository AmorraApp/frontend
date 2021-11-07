import { cl as classNames } from 'common/utils';
import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import SafeAnchor from '../safe-anchor';
import styles from './breadcrumb.scss';

const propTypes = {

  /**
   * Adds a visual "active" state to a Breadcrumb
   * Item and disables the link.
   */
  active: PropTypes.bool,
  /**
   * `href` attribute for the inner `a` element
   */
  href: PropTypes.string,
  /**
   * You can use a custom element type for this component's inner link.
   */
  linkAs: PropTypes.elementType,
  /**
   * `title` attribute for the inner `a` element
   */
  title: PropTypes.node,
  /**
   * `target` attribute for the inner `a` element
   */
  target: PropTypes.string,
  /**
   * Additional props passed as-is to the underlying link for non-active items.
   */
  linkProps: PropTypes.object,

  as: PropTypes.elementType,
};

const defaultProps = {
  active: false,
  linkProps: {},
};

const BreadcrumbItem = forwardRef(({
  active,
  children,
  className,
  as: Component = 'li',
  linkAs: LinkComponent = SafeAnchor,
  linkProps,
  href,
  title,
  target,
  ...props
}, ref) => (
  <Component ref={ref} {...props} className={classNames(styles['breadcrumb-item'], className, active && styles.active )} aria-current={active ? 'page' : undefined}>
    {active ? (children) : (
      <LinkComponent {...linkProps} href={href} title={title} target={target}>
        {children}
      </LinkComponent>
    )}
  </Component>
));
BreadcrumbItem.displayName = 'BreadcrumbItem';
BreadcrumbItem.propTypes = propTypes;
BreadcrumbItem.defaultProps = defaultProps;
export default BreadcrumbItem;
