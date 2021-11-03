
export { default as Tabs } from './Tabs';
export { default as Tab } from './Tab';
export { default as TabContainer } from './TabContainer';
export { default as TabContext } from './TabContext';
export { default as TabPane } from './TabPane';
export { default as TabContent } from './TabContent';

import _Tabs from './Tabs';
import Tab from './Tab';
import TabContainer from './TabContainer';
import TabPane from './TabPane';
import TabContent from './TabContent';

function Tabs (...args) {
  return _Tabs(...args);
}

Tabs.Tab          = Tab;
Tabs.Container    = TabContainer;
Tabs.Pane         = TabPane;
Tabs.Content      = TabContent;
Tabs.propTypes    = _Tabs.propTypes;
Tabs.defaultProps = _Tabs.defaultProps;
Tabs.displayName  = 'Tabs';

export default Tabs;
