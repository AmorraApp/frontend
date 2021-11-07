
import PropTypes from 'prop-types';
import { cl as classNames, assert, isFunction } from 'common/utils';
import { forwardRef, useCallback, useMemo } from 'react';
import useDrawerContext, { DrawerContextProvider } from './useDrawerContext';
import styles from './drawer.scss';
import { isElement } from 'common/children';
import useIsobound, { IsoboundContextProvider, IsoboundOutput } from 'common/ui/isobound';
import { v4 as uuid } from 'uuid';

const VARIANTS = [
  'input', 'brand', 'primary', 'secondary', 'success', 'danger', 'warning', 'info', 'dark', 'light', 'link',
  'grade-a', 'grade-b', 'grade-c', 'grade-d', 'grade-f',
];

export const DrawerContainer = forwardRef(({
  as: Component = 'div',
  className,
  contain,
  offset,
  justify,
  align = 'left',
  open,
  children,
  ...props
}, ref) => (
  <IsoboundContextProvider>
    <DrawerContextProvider open={open} align={align}>
      <Component
        {...props}
        className={classNames(
          className,
          styles.container,
          contain && styles.contain,
          justify && styles['container-' + justify],
          align && styles['container-' + align],
        )}
        ref={ref}
      >
        {children}
        <div className={styles.drawers}>
          <IsoboundOutput />
          <div className={styles.tabs} style={{ paddingTop: offset, paddingBottom: offset }}>
            <IsoboundOutput>{DrawerTab}</IsoboundOutput>
          </div>
        </div>
      </Component>
    </DrawerContextProvider>
  </IsoboundContextProvider>
));
DrawerContainer.propTypes = {
  as: PropTypes.elementType,
  contain: PropTypes.bool,
  offset: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  align: PropTypes.oneOf([ 'left', 'right', 'top', 'bottom' ]),
  justify: PropTypes.oneOf([
    'start',
    'center',
    'end',
    'stretch',
    'between',
    'around',
    'evenly',
  ]),
  open: PropTypes.any,
  className: PropTypes.string,
};
DrawerContainer.displayName = 'DrawerContainer';

const propTypes = {
  caption: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
    PropTypes.func,
  ]).isRequired,
  eventKey: PropTypes.any,
  disabled: PropTypes.bool,
  gutterless: PropTypes.bool,
  onShow: PropTypes.func,
  onHide: PropTypes.func,
  onToggle: PropTypes.func,
  onClick: PropTypes.func,
  size: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  tabClassName: PropTypes.string,
  className: PropTypes.string,
  variant: PropTypes.oneOf(VARIANTS),
  width: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  height: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
};

const Drawer = forwardRef(({
  caption,
  eventKey,
  disabled,
  className,
  tabClassName,
  children,
  onClick,
  onShow,
  onHide,
  onToggle,
  variant = 'primary',
  width,
  height,
  style,
  ...props
}, ref) => {

  eventKey = useMemo(() => eventKey || uuid().replace(/[^a-zA-Z0-9]/g, '').substr(-8), [ eventKey ]);
  assert(eventKey, 'The "eventKey" property must be a truthy value.');

  const { setActiveKey, getActiveKey, align } = useDrawerContext();
  const active = getActiveKey() === eventKey;

  const handleClick = useCallback((ev) => {
    if (disabled) return;
    onClick && onClick(eventKey, ev);
    if (ev.defaultPrevented) return;
    const activeKey = getActiveKey();
    if (!activeKey || activeKey !== eventKey) {
      setActiveKey(eventKey);
      if (!ev.defaultPrevented) {
        onToggle && onToggle(eventKey, ev);
        activeKey && onHide && onHide(activeKey, ev);
        onShow && onShow(eventKey, ev);
      }
    } else if (activeKey === eventKey) {
      setActiveKey(false);
      if (!ev.defaultPrevented) {
        onToggle && onToggle(false, ev);
        activeKey && onHide && onHide(activeKey, ev);
      }
    }
  }, [ onClick, disabled ]);

  const cssTarget = {
    left: 'width',
    right: 'width',
    top: 'height',
    bottom: 'height',
  }[align];
  const dimension = pxCoerce(width || height);

  const drawerStyle = {
    ...style,
    [cssTarget]: (active ? dimension : 0),
    flexBasis: (active ? dimension : 0),
  };

  const body = (
    <div
      className={classNames(
        styles.drawer,
        variant && styles[`drawer-${variant}`],
        active && styles.active,
      )}
      {...props}
      ref={ref}
      style={drawerStyle}
    >
      <div className={classNames(className, styles['drawer-content'])} style={{ [cssTarget]: dimension }}>{children}</div>
    </div>
  );

  useIsobound(body, {
    caption,
    eventKey,
    tabClassName,
    onClick: handleClick,
    variant,
  }, 'DrawerPanel');

  return null;
});

Drawer.displayName = 'Drawer';
Drawer.propTypes = propTypes;

Drawer.VARIANTS = VARIANTS;
Drawer.Container = DrawerContainer;
Drawer.TabLabel = TabLabel;
export default Drawer;

function DrawerTab ({
  eventKey,
  caption,
  tabClassName,
  onClick,
  variant = 'primary',
  disabled,
  gutterless,
}) {
  if (isFunction(caption)) caption = caption(eventKey);

  const { activeKey } = useDrawerContext();

  let label = caption;
  if (!isElement(caption)) {
    label = <TabLabel label={caption} />;
  }

  return (
    <div
      className={classNames(
        tabClassName,
        styles.tab,
        variant && styles[`tab-${variant}`],
        activeKey === eventKey && styles.active,
        disabled && styles.disabled,
        gutterless && styles.gutterless,
      )}
      onClick={onClick}
    >
      {label}
    </div>
  );
}
DrawerTab.propTypes = {
  eventKey: PropTypes.any,
  caption: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
    PropTypes.func,
  ]).isRequired,
  tabClassName: PropTypes.string,
  disabled: PropTypes.bool,
  gutterless: PropTypes.bool,
  variant: PropTypes.oneOf(VARIANTS),
};
DrawerTab.VARIANTS = VARIANTS;


export function TabLabel ({ label }) {
  const { align } = useDrawerContext();
  const cssTarget = {
    left: 'height',
    right: 'height',
    top: 'width',
    bottom: 'width',
  }[align];

  return (
    <div className={styles['tab-caption']} style={{ [cssTarget]: String(label).length + 'ch' }}>
      <span>{String(label)}</span>
    </div>
  );
}
TabLabel.propTypes = { label: PropTypes.string };

function pxCoerce (input) {
  if (!input) return '0';
  if (typeof input === 'number') return `${input}px`;
  return String(input);
}
