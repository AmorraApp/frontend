import { cl as classNames } from 'common/utils';
import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import * as styles from './sidenav.scss';
import useSideNavContext from './SideNavContext';

const propTypes = {
  /**
   * Uniquely idenifies the `NavItem` amongst its siblings,
   * used to determine and control the active state of the parent `Nav`
   */
  eventKey: PropTypes.any,

  /** @default 'div' */
  as: PropTypes.elementType,
};

const SideNavPane = forwardRef(({
  as: Component = 'div',
  eventKey,
  className,
  children,
}, ref) => {
  const { activeKey } = useSideNavContext();

  return (
    <Component
      ref={ref}
      className={classNames(
        className,
        styles['sidenav-pane'],
        eventKey === activeKey && styles.active,
      )}
      data-event-key={eventKey}
    >{children}</Component>
  );
});
SideNavPane.propTypes = propTypes;
SideNavPane.displayName = 'SideNavPane';

export default SideNavPane;
