import { cl as classNames, isUndefinedOrNull, qsa } from 'common/utils';
import PropTypes from 'prop-types';
import { forwardRef, useRef, useCallback, useEffect } from 'react';
import useEventCallback from 'common/hooks/useEventCallback';
import usePrevious from 'common/hooks/usePrevious';
import useDerivedState from 'common/hooks/useDerivedState';
import useGettableState from 'common/hooks/useGettableState';
import useMemoObject from 'common/hooks/useMemoObject';
import useMergedRefs from 'common/hooks/useMergedRefs';
import useGlobalListener from 'common/hooks/useGlobalListener';

import useSelectableContext, { SelectableContextProvider } from 'common/selectable-context';
import { DropdownProvider } from './useDropdownContext';

import styles from './dropdown.scss';
export {
  styles as Classes,
};

function matches (el, selector) {
  const body = document.body;
  return (body.matches || body.matchesSelector || body.webkitMatchesSelector || body.mozMatchesSelector || body.msMatchesSelector).call(el, selector);
}

const alignDirection = PropTypes.oneOf([ 'start', 'center', 'end' ]);

export const alignPropType = PropTypes.oneOfType([
  alignDirection,
  PropTypes.shape({ sm: alignDirection }),
  PropTypes.shape({ md: alignDirection }),
  PropTypes.shape({ lg: alignDirection }),
  PropTypes.shape({ xl: alignDirection }),
]);

const propTypes = {

  className: PropTypes.string,

  /**
   * Determines the direction and location of the Menu in relation to it's Toggle.
   */
  drop: PropTypes.oneOf([ 'up', 'left', 'right', 'down', 'bottom', 'top' ]),

  /**
   * Aligns the dropdown menu to the specified side of the container. You can also align
   * the menu responsively for breakpoints starting at `sm` and up. The alignment
   * direction will affect the specified breakpoint or larger.
   *
   * *Note: Using responsive alignment will disable Popper usage for positioning.*
   *
   * @type {"left"|"right"|{ sm: "left"|"right" }|{ md: "left"|"right" }|{ lg: "left"|"right" }|{ xl: "left"|"right"} }
   */
  align: alignPropType,

  as: PropTypes.elementType,

  /**
   * Whether or not the Dropdown is visible.
   *
   * @controllable onToggle
   */
  show: PropTypes.bool,

  /**
   * Extra class to append when displaying the dropdown
   */
  showClassName: PropTypes.string,

  /**
   * Allow Dropdown to flip in case of an overlapping on the reference element. For more information refer to
   * Popper.js's flip [docs](https://popper.js.org/docs/v2/modifiers/flip/).
   *
   */
  flip: PropTypes.bool,

  activeKey: PropTypes.any,

  /**
   * A callback fired when the Dropdown wishes to change visibility. Called with the requested
   * `show` value, the DOM event, and the source that fired it: `'click'`,`'keydown'`,`'rootClose'`, or `'select'`.
   *
   * ```js
   * function(
   *   isOpen: boolean,
   *   event: SyntheticEvent,
   *   metadata: {
   *     source: 'select' | 'click' | 'rootClose' | 'keydown'
   *   }
   * ): void
   * ```
   *
   */
  onToggle: PropTypes.func,

  /**
   * A callback fired when a menu item is selected.
   *
   * ```js
   * (eventKey: any, event: Object) => any
   * ```
   */
  onSelect: PropTypes.func,

  /**
   * Controls the focus behavior for when the Dropdown is opened. Set to
   * `true` to always focus the first menu item, `keyboard` to focus only when
   * navigating via the keyboard, or `false` to disable completely
   *
   * The Default behavior is `false` **unless** the Menu has a `role="menu"`
   * where it will default to `keyboard` to match the recommended [ARIA Authoring practices](https://www.w3.org/TR/wai-aria-practices-1.1/#menubutton).
   */
  focusFirstItemOnShow: PropTypes.oneOf([ false, true, 'keyboard' ]),

  /**
   * A css slector string that will return __focusable__ menu items.
   * Selectors should be relative to the menu component:
   * e.g. ` > li:not('.disabled')`
   */
  itemSelector: PropTypes.string,
};

const Dropdown = forwardRef(({
  flip,
  drop,
  align,
  show: oShow,
  activeKey,
  className,
  showClassName,
  onSelect,
  onToggle,
  focusFirstItemOnShow,
  as: Component = 'div',
  itemSelector = `.${styles['dropdown-item']}:not(${styles.disabled}):not(:disabled)`,
  ...props
}, ref) => {
  const { onSelect: onSelectCtx } = useSelectableContext();

  const [ show, setShow, getShow ] = useDerivedState(() => !!oShow, [ oShow ]);

  const parentRef = useRef();
  const mergedRef = useMergedRefs(ref, parentRef);

  const [ menuElement_, setMenu, getMenu ] = useGettableState();
  const [ toggleElement_, setToggle, getToggle ] = useGettableState();

  const toggle = useCallback((nextShow = !getShow(), ev) => {
    setShow(nextShow);
    onToggle && onToggle(nextShow, ev);
  }, [ onToggle, setShow, getShow ]);

  const context = useMemoObject({
    flip,
    drop,
    align,
    show,
    toggle,
    setMenu,
    getMenu,
    setToggle,
    getToggle,
    parentRef,
  });

  const lastShow = usePrevious(show);
  const lastSourceEvent = useRef(null);
  const focusInDropdown = useRef(false);

  if (menuElement_ && lastShow && !show) {
    focusInDropdown.current = menuElement_.contains(document.activeElement);
  }

  const focusToggle = useEventCallback(() => {
    toggleElement_ && toggleElement_.focus && toggleElement_.focus();
  });

  const maybeFocusFirst = useEventCallback(() => {
    const menuElement = getMenu();
    const type = lastSourceEvent.current;
    let focusType = focusFirstItemOnShow;
    if (isUndefinedOrNull(focusType)) {
      focusType =
        menuElement && matches(menuElement, '[role=menu]')
          ? 'keyboard'
          : false;
    }
    if (focusType === false ||
      (focusType === 'keyboard' && !/^key.+$/.test(type))) {
      return;
    }
    const first = qsa(menuElement, itemSelector)[0];
    if (first && first.focus) first.focus();
  });

  const getNextFocusedChild = useCallback((current, offset) => {
    const menuElement = getMenu();
    if (!menuElement) return null;
    const items = qsa(menuElement, itemSelector);
    let index = items.indexOf(current) + offset;
    index = Math.max(0, Math.min(index, items.length));
    return items[index];
  }, [ itemSelector ]);

  useGlobalListener('keydown', (ev) => {
    const menuElement = getMenu();
    const toggleElement = getToggle();
    const { key, target } = ev;
    const fromMenu = menuElement && menuElement.contains(target);
    const fromToggle = toggleElement && toggleElement.contains(target);
    // Second only to https://github.com/twbs/bootstrap/blob/8cfbf6933b8a0146ac3fbc369f19e520bd1ebdac/js/src/dropdown.js#L400
    // in inscrutability
    const isInput = /input|textarea/i.test(target.tagName);
    if (isInput && (key === ' ' || (key !== 'Escape' && fromMenu))) {
      return;
    }
    if (!fromMenu && !fromToggle) {
      return;
    }
    lastSourceEvent.current = ev.type;
    switch (key) {
    case 'ArrowUp': {
      const next = getNextFocusedChild(target, -1);
      if (next && next.focus) next.focus();
      ev.preventDefault();
      return;
    }
    case 'ArrowDown':
      ev.preventDefault();
      if (!show) onToggle(true, ev);
      else {
        const next = getNextFocusedChild(target, 1);
        if (next && next.focus) next.focus();
      }
      return;
    case 'Escape':
    case 'Tab':
      if (key === 'Escape') {
        ev.preventDefault();
        ev.stopPropagation();
      }
      onToggle(false, ev);
      break;
    default:
    }
  });

  const handleToggle = useEventCallback((nextShow, ev, source = ev.type) => {
    if (ev.currentTarget === document) { source = 'rootClose'; }
    onToggle && onToggle(nextShow, ev, { source });
  });

  const handleSelect = useEventCallback((key, ev) => {
    if (onSelectCtx) { onSelectCtx(key, ev); }
    if (onSelect) { onSelect(key, ev); }
    setShow(false);
    handleToggle(false, ev, 'select');
  });

  useEffect(() => {
    if (show) maybeFocusFirst();
    else if (focusInDropdown.current) {
      focusInDropdown.current = false;
      focusToggle();
    }
    // only `show` should be changing
  }, [ show, focusInDropdown, focusToggle, maybeFocusFirst ]);

  useEffect(() => {
    lastSourceEvent.current = null;
  });

  return (
    <SelectableContextProvider activeKey={activeKey} onSelect={handleSelect}>
      <DropdownProvider value={context}>
        <Component
          {...props}
          ref={mergedRef}
          className={classNames(
            className,
            show && styles.show,
            show && showClassName,
            (!drop || drop === 'down') && styles.dropdown,
            drop === 'up' && styles.dropup,
            drop === 'right' && styles.dropright,
            drop === 'left' && styles.dropleft,
          )}
        />
      </DropdownProvider>
    </SelectableContextProvider>
  );
});
Dropdown.displayName = 'Dropdown';
Dropdown.propTypes = propTypes;
export default Dropdown;
