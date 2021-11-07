/* eslint-disable react/no-multi-comp */
import { cl as classNames } from 'common/utils';
import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import SafeAnchor from '../safe-anchor';
import styles from './pagination.scss';
import AngleDoubleLeft from 'common/svgs/solid/angle-double-left.svg';
import AngleDoubleRight from 'common/svgs/solid/angle-double-right.svg';
import AngleLeft from 'common/svgs/solid/angle-left.svg';
import AngleRight from 'common/svgs/solid/angle-right.svg';
import { ensureChild } from 'common/children';

const propTypes = {
  /** Disables the PageItem */
  disabled: PropTypes.bool,
  /** Styles PageItem as active, and renders a `<span>` instead of an `<a>`. */
  active: PropTypes.bool,
  /** Styles PageItem as inactive, and renders a `<span>` instead of an `<a>`. */
  inactive: PropTypes.bool,
  /** An accessible label indicating the active state.. */
  activeLabel: PropTypes.string,
};

const defaultProps = {
  active: false,
  disabled: false,
  activeLabel: '(current)',
};

const PageItem = forwardRef(({
  active,
  inactive,
  disabled,
  className,
  style,
  activeLabel,
  children,
  ...props
}, ref) => {
  const Component = active || disabled ? 'span' : SafeAnchor;
  return (
    <li
      ref={ref}
      style={style}
      className={classNames(
        className,
        styles['page-item'],
        active && styles.active,
        inactive && styles.inactive,
        disabled && styles.disabled,
      )}
    >
      <Component className={styles['page-link']} disabled={disabled} {...props}>
        {children}
        {active && activeLabel && (<span className={styles['sr-only']}>{activeLabel}</span>)}
      </Component>
    </li>
  );
});
PageItem.propTypes = propTypes;
PageItem.defaultProps = defaultProps;
PageItem.displayName = 'PageItem';
export default PageItem;

function createButton (name, defaultValue, label = name) {
  function Button ({ children, ...props }) {
    return (<PageItem {...props}>
      <span aria-hidden="true">{children || ensureChild(defaultValue)}</span>
      <span className={styles['sr-only']}>{label}</span>
    </PageItem>);
  }
  Button.displayName = name;
  return Button;
}

export const First = createButton('First', AngleDoubleLeft);
export const Prev = createButton('Prev', AngleLeft, 'Previous');
export const Ellipsis = createButton('Ellipsis', '…', 'More');
export const Next = createButton('Next', AngleRight);
export const Last = createButton('Last', AngleDoubleRight);
