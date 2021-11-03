import PropTypes from 'prop-types';
import { Children, cloneElement, useCallback, useRef } from 'react';
import { useTimeout } from 'common/hooks';

import { useUncontrolledProp } from 'uncontrollable';
import Overlay from './index';

function normalizeDelay (delay) {
  return delay && typeof delay === 'object'
    ? delay
    : {
      show: delay,
      hide: delay,
    };
}

// Simple implementation of mouseEnter and mouseLeave.
// React's built version is broken: https://github.com/facebook/react/issues/4251
// for cases when the trigger is disabled and mouseOut/Over can cause flicker
// moving from one child element to another.
function handleMouseOverOut (handler, args, relatedNative) {
  const [ e ] = args;
  const target = e.currentTarget;
  const related = e.relatedTarget || e.nativeEvent[relatedNative];
  if ((!related || related !== target) && !target.contains(related)) {
    handler(...args);
  }
}

const triggerType = PropTypes.oneOf([ 'click', 'hover', 'focus' ]);

const propTypes = {
  children: PropTypes.oneOfType([ PropTypes.element, PropTypes.func ]).isRequired,

  /**
   * Specify which action or actions trigger Overlay visibility
   *
   * @type {'hover' | 'click' |'focus' | Array<'hover' | 'click' |'focus'>}
   */
  trigger: PropTypes.oneOfType([ triggerType, PropTypes.arrayOf(triggerType) ]),

  /**
   * A millisecond delay amount to show and hide the Overlay once triggered
   */
  delay: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.shape({
      show: PropTypes.number,
      hide: PropTypes.number,
    }),
  ]),

  /**
   * The visibility of the Overlay. `show` is a _controlled_ prop so should be paired
   * with `onToggle` to avoid breaking user interactions.
   *
   * Manually toggling `show` does **not** wait for `delay` to change the visibility.
   *
   * @controllable onToggle
   */
  show: PropTypes.bool,

  /**
   * The initial visibility state of the Overlay.
   */
  defaultShow: PropTypes.bool,

  /**
   * A callback that fires when the user triggers a change in tooltip visibility.
   *
   * `onToggle` is called with the desired next `show`, and generally should be passed
   * back to the `show` prop. `onToggle` fires _after_ the configured `delay`
   *
   * @controllable `show`
   */
  onToggle: PropTypes.func,

  /**
    The initial flip state of the Overlay.
   */
  flip: PropTypes.bool,

  /**
   * An element or text to overlay next to the target.
   */
  overlay: PropTypes.oneOfType([ PropTypes.func, PropTypes.element.isRequired ]),

  // Overridden props from `<Overlay>`.
  /**
   * @private
   */
  target: PropTypes.oneOfType([ PropTypes.element, PropTypes.elementType, PropTypes.func, PropTypes.ref ]),

  /**
   * @private
   */
  onHide: PropTypes.oneOf([ null ]),

  /**
   * The placement of the Overlay in relation to it's `target`.
   */
  placement: PropTypes.oneOf([
    'auto-start',
    'auto',
    'auto-end',
    'top-start',
    'top',
    'top-end',
    'right-start',
    'right',
    'right-end',
    'bottom-end',
    'bottom',
    'bottom-start',
    'left-end',
    'left',
    'left-start',
  ]),
};

const defaultProps = {
  defaultShow: false,
  trigger: [ 'hover', 'focus' ],
};

function OverlayTrigger (fullProps) {
  const {
    trigger,
    overlay,
    children,
    show: propsShow,
    defaultShow = false,
    onToggle,
    delay: propsDelay,
    placement,
    flip = placement && placement.indexOf('auto') !== -1,
    ...props
  } = fullProps;

  const triggerNodeRef = useRef(null);
  const timeout = useTimeout();
  const hoverStateRef = useRef('');
  const [ show, setShow ] = useUncontrolledProp(propsShow, defaultShow, onToggle);
  const delay = normalizeDelay(propsDelay);
  const { onFocus, onBlur, onClick } = typeof children === 'function'
    ? {}
    : Children.only(children).props
  ;
  const handleShow = useCallback(() => {
    timeout.clear();
    hoverStateRef.current = 'show';
    if (!delay.show) {
      setShow(true);
      return;
    }
    timeout.set(() => {
      if (hoverStateRef.current === 'show') { setShow(true); }
    }, delay.show);
  }, [ delay.show, setShow, timeout ]);

  const handleHide = useCallback(() => {
    timeout.clear();
    hoverStateRef.current = 'hide';
    if (!delay.hide) {
      setShow(false);
      return;
    }
    timeout.set(() => {
      if (hoverStateRef.current === 'hide') { setShow(false); }
    }, delay.hide);
  }, [ delay.hide, setShow, timeout ]);

  const handleFocus = useCallback((...args) => {
    handleShow();
    onFocus?.(...args);
  }, [ handleShow, onFocus ]);

  const handleBlur = useCallback((...args) => {
    handleHide();
    onBlur?.(...args);
  }, [ handleHide, onBlur ]);

  const handleClick = useCallback((...args) => {
    setShow(!show);
    if (onClick) { onClick(...args); }
  }, [ onClick, setShow, show ]);

  const handleMouseOver = useCallback((...args) => {
    handleMouseOverOut(handleShow, args, 'fromElement');
  }, [ handleShow ]);

  const handleMouseOut = useCallback((...args) => {
    handleMouseOverOut(handleHide, args, 'toElement');
  }, [ handleHide ]);

  const triggers = trigger ? [].concat(trigger) : [];

  const triggerProps = {};
  if (triggers.indexOf('click') !== -1) {
    triggerProps.onClick = handleClick;
  }

  if (triggers.indexOf('focus') !== -1) {
    triggerProps.onFocus = handleFocus;
    triggerProps.onBlur = handleBlur;
  }

  if (triggers.indexOf('hover') !== -1) {
    triggerProps.onMouseOver = handleMouseOver;
    triggerProps.onMouseOut = handleMouseOut;
  }

  return (<>
    {
      typeof children === 'function'
        ? children({ ...triggerProps, ref: triggerNodeRef })
        : cloneElement(children, { ...triggerProps, ref: triggerNodeRef })
    }
    <Overlay {...props} show={show} onHide={handleHide} flip={flip} placement={placement} target={triggerNodeRef}>
      {overlay}
    </Overlay>
  </>);
}
OverlayTrigger.displayName = 'OverlayTrigger';
OverlayTrigger.propTypes = propTypes;
OverlayTrigger.defaultProps = defaultProps;
export default OverlayTrigger;
