import { cl as classNames, isUndefinedOrNull } from 'common/utils';
import { forwardRef, useContext } from 'react';
import PropTypes from 'prop-types';

import TabContext from './TabContext';
import { SelectableContextProvider } from 'common/selectable-context';
import Fade from 'common/ui/fade';
import styles from 'common/ui/nav/nav.scss';

const propTypes = {

  as: PropTypes.elementType,
  /**
     * A key that associates the `TabPane` with it's controlling `NavLink`.
     */
  eventKey: PropTypes.any,
  /**
     * Toggles the active state of the TabPane, this is generally controlled by a
     * TabContainer.
     */
  active: PropTypes.bool,
  /**
     * Use animation when showing or hiding `<TabPane>`s. Defaults to `<Fade>`
     * animation, else use `false` to disable or a react-transition-group
     * `<Transition/>` component.
     */
  transition: PropTypes.oneOfType([ PropTypes.bool, PropTypes.elementType ]),
  /**
     * Transition onEnter callback when animation is not `false`
     */
  onEnter: PropTypes.func,
  /**
     * Transition onEntering callback when animation is not `false`
     */
  onEntering: PropTypes.func,
  /**
     * Transition onEntered callback when animation is not `false`
     */
  onEntered: PropTypes.func,
  /**
     * Transition onExit callback when animation is not `false`
     */
  onExit: PropTypes.func,
  /**
     * Transition onExiting callback when animation is not `false`
     */
  onExiting: PropTypes.func,
  /**
     * Transition onExited callback when animation is not `false`
     */
  onExited: PropTypes.func,
  /**
     * Wait until the first "enter" transition to mount the tab (add it to the DOM)
     */
  mountOnEnter: PropTypes.bool,
  /**
     * Unmount the tab (remove it from the DOM) when it is no longer visible
     */
  unmountOnExit: PropTypes.bool,
  /** @ignore * */
  id: PropTypes.string,
  /** @ignore * */
  'aria-labelledby': PropTypes.string,
};

function useTabContext ({ active, ...props }) {
  const context = useContext(TabContext);
  if (!context) { return props; }
  const { activeKey, getControlledId, getControllerId, ...rest } = context;
  const shouldTransition = props.transition !== false && rest.transition !== false;

  if (isUndefinedOrNull(active)) {
    if (!isUndefinedOrNull(activeKey)) active = activeKey === props.eventKey;
  }

  return {
    ...props,
    active,
    id: getControlledId(props.eventKey),
    'aria-labelledby': getControllerId(props.eventKey),
    transition: shouldTransition && (props.transition || rest.transition || Fade),
    mountOnEnter: props.mountOnEnter ? props.mountOnEnter : rest.mountOnEnter,
    unmountOnExit: props.unmountOnExit ? props.unmountOnExit : rest.unmountOnExit,
  };
}

const TabPane = forwardRef((props, ref) => {
  const {
    className,
    active,
    onEnter,
    onEntering,
    onEntered,
    onExit,
    onExiting,
    onExited,
    mountOnEnter,
    unmountOnExit,
    transition: Transition,
    as: Component = 'div',
    eventKey, // eslint-disable-line
    ...rest
  } = useTabContext(props);

  if (!active && !Transition && unmountOnExit) { return null; }

  let pane = (
    <Component {...rest} ref={ref} role="tabpanel" aria-hidden={!active} className={classNames(className, styles['tab-pane'], active && styles.active)} />
  );

  if (Transition) {
    pane = (
      <Transition
        in={active}
        onEnter={onEnter}
        onEntering={onEntering}
        onEntered={onEntered}
        onExit={onExit}
        onExiting={onExiting}
        onExited={onExited}
        mountOnEnter={mountOnEnter}
        unmountOnExit={unmountOnExit}
      >{pane}</Transition>
    );
  }

  // We provide an empty the TabContext so `<Nav>`s in `<TabPane>`s don't
  // conflict with the top level one.
  return (
    <TabContext.Provider value={null}>
      <SelectableContextProvider>
        {pane}
      </SelectableContextProvider>
    </TabContext.Provider>
  );
});

TabPane.displayName = 'TabPane';
TabPane.propTypes = propTypes;
export default TabPane;
