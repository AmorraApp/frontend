import { cl as classNames } from 'common/utils';
import PropTypes from 'prop-types';
import { forwardRef, useCallback } from 'react';
import SafeAnchor from 'common/ui/safe-anchor';
import styles from './sidenav.scss';
import Badge from 'common/ui/badge';
import useSideNavContext from './SideNavContext';
import { cloneChildren } from '../../children';

// eslint-disable-next-line react/prop-types
const SubNav = ({ as: Component = 'ul', ...props }) => (<Component {...props} className={styles.subnav} />);

const propTypes = {

  label: PropTypes.string,

  /**
   * The active state of the NavItem item.
   */
  active: PropTypes.bool,

  /**
   * The disabled state of the NavItem item.
   */
  disabled: PropTypes.bool,

  /**
   * The ARIA role for the `SideNavItem`, In the context of a 'tablist' parent Nav,
   * the role defaults to 'tab'
   * */
  role: PropTypes.string,

  /** The HTML href attribute for the `SideNavItem` */
  href: PropTypes.string,

  /** A callback fired when the `SideNavItem` is selected.
   *
   * ```js
   * function (eventKey: any, event: SyntheticEvent) {}
   * ```
   */
  onSelect: PropTypes.func,

  /**
   * Uniquely idenifies the `NavItem` amongst its siblings,
   * used to determine and control the active state of the parent `Nav`
   */
  eventKey: PropTypes.string,

  parentKey: PropTypes.string,

  jumpTo: PropTypes.string,

  /** @default 'li' */
  as: PropTypes.elementType,

  /** @default SafeAnchor */
  linkAs: PropTypes.elementType,

  /** @default 'ul' */
  subNavAs: PropTypes.elementType,

  badge: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
};

const defaultProps = {
  disabled: false,
  as: 'li',
  subNavAs: 'ul',
  linkAs: SafeAnchor,
};

const SideNavItem = forwardRef(({
  label,
  className,
  as: ItemComponent,
  linkAs: ItemLinkComponent,
  disabled,
  subNavAs,
  children,
  badge,
  eventKey,
  parentKey,
  jumpTo,
  ...props
}, ref) => {
  const { usingHash, activeKey, switchTo, computeHref } = useSideNavContext();
  if (parentKey && !eventKey) eventKey = parentKey;

  const onClick = usingHash ? undefined :
    useCallback(() => {
      switchTo(eventKey, jumpTo);
    }, [ eventKey, switchTo ]);

  return (
    <ItemComponent
      className={classNames(
        className,
        styles['sidenav-item'],
        disabled && styles.disabled,
        eventKey === activeKey && eventKey !== parentKey && styles.active,
      )}
    >
      <ItemLinkComponent
        {...props}
        ref={ref}
        disabled={disabled}
        href={computeHref(eventKey)}
        onClick={onClick}
        className={classNames(
          styles['sidenav-link'],
        )}
        data-event-key={eventKey}
      >
        <span className={styles['sidenav-item-caption']}>{label}</span>
        {badge && <Badge className={styles['sidenav-item-badge']}>{badge}</Badge>}
      </ItemLinkComponent>
      {children && <SubNav as={subNavAs}>{cloneChildren(children, { parentKey: eventKey })}</SubNav>}
    </ItemComponent>
  );
});
SideNavItem.displayName = 'SideNavItem';
SideNavItem.propTypes = propTypes;
SideNavItem.defaultProps = defaultProps;
export default SideNavItem;
