import PropTypes from 'prop-types';
import { useUncontrolled } from 'uncontrollable';
import Nav, { NavLink, NavItem } from '../nav';
import TabContainer from './TabContainer';
import TabContent from './TabContent';
import TabPane from './TabPane';
import { mapChildren, forEachChild } from 'common/children';

const propTypes = {
  /**
     * Mark the Tab with a matching `eventKey` as active.
     *
     * @controllable onSelect
     */
  activeKey: PropTypes.any,
  /** The default active key that is selected on start */
  defaultActiveKey: PropTypes.any,

  /**
     * Navigation style
     *
     * @type {('tabs'| 'pills')}
     */
  variant: PropTypes.string,

  /**
     * Sets a default animation strategy for all children `<TabPane>`s.
     * Defaults to `<Fade>` animation, else use `false` to disable or a
     * react-transition-group `<Transition/>` component.
     *
     * @type {Transition | false}
     * @default {Fade}
     */
  transition: PropTypes.oneOfType([
    PropTypes.oneOf([ false ]),
    PropTypes.elementType,
  ]),

  /**
     * HTML id attribute, required if no `generateChildId` prop
     * is specified.
     *
     * @type {string}
     */
  id: PropTypes.string,

  /**
     * Callback fired when a Tab is selected.
     *
     * ```js
     * function (
     *   Any eventKey,
     *   SyntheticEvent event?
     * )
     * ```
     *
     * @controllable activeKey
     */
  onSelect: PropTypes.func,

  /**
     * Wait until the first "enter" transition to mount tabs (add them to the DOM)
     */
  mountOnEnter: PropTypes.bool,

  /**
     * Unmount tabs (remove it from the DOM) when it is no longer visible
     */
  unmountOnExit: PropTypes.bool,

};

const defaultProps = {
  variant: 'tabs',
  mountOnEnter: false,
  unmountOnExit: false,
};

function getDefaultActiveKey (children) {
  let defaultActiveKey;
  forEachChild(children, (child) => {
    if (!defaultActiveKey) {
      defaultActiveKey = child.props.eventKey;
    }
  });
  return defaultActiveKey;
}

function renderTab (child, key) {
  const { title, tabClassName, ...props } = child.props;
  if (!title) {
    return null;
  }
  return (
    <NavItem {...props} key={key} as={NavLink} className={tabClassName}>
      {title}
    </NavItem>
  );
}

const Tabs = (props) => {
  const {
    id,
    onSelect,
    transition,
    mountOnEnter,
    unmountOnExit,
    children,
    activeKey = getDefaultActiveKey(children),
    ...controlledProps
  } = useUncontrolled(props, {
    activeKey: 'onSelect',
  });

  return (
    <TabContainer id={id} activeKey={activeKey} onSelect={onSelect} transition={transition} mountOnEnter={mountOnEnter} unmountOnExit={unmountOnExit}>
      <Nav {...controlledProps} role="tablist" as="nav">
        {mapChildren(children, renderTab)}
      </Nav>

      <TabContent>
        {mapChildren(children, (child, i) => {
          const { title, disabled, tabClassName, ...childProps } = child.props; // eslint-disable-line no-unused-vars
          return <TabPane key={i} {...childProps} />;
        })}
      </TabContent>
    </TabContainer>
  );
};
Tabs.propTypes = propTypes;
Tabs.defaultProps = defaultProps;
Tabs.displayName = 'Tabs';
export default Tabs;
