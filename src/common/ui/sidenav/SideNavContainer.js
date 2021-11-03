
import { cl as classNames } from 'common/utils';
import { useRef } from 'react';
import PropTypes from 'prop-types';
import { SideNavContextProvider } from './SideNavContext';
import * as styles from './sidenav.scss';


const propTypes = {

  /**
   * Marks the NavItem with a matching `eventKey` (or `href` if present) as active.
   *
   * @type {string}
   */
  activeKey: PropTypes.string,

  /**
   * A callback fired when a NavItem is selected.
   *
   * ```js
   * function (
   *  Any eventKey,
   *  SyntheticEvent event?
   * )
   * ```
   */
  onSelect: PropTypes.func,

  /**
   * If provided, this defines the key that will be used for reading and writing the currently
   * selected pane to the page url hash, preserving selected pane across page reloads.
   */
  hashKey: PropTypes.string,

  /** @default 'div' */
  as: PropTypes.elementType,
};

export default function SideNavContainer ({
  className,
  children,
  as: Component = 'div',
  style,
  ...props
}) {
  const containerRef = useRef();
  return (
    <SideNavContextProvider {...props} container={containerRef}>
      <Component ref={containerRef} className={classNames(className, styles['sidenav-container'])} style={style}>
        <div className={styles['sidenav-fill']} />
        {children}
      </Component>
    </SideNavContextProvider>
  );
}
SideNavContainer.propTypes = propTypes;
