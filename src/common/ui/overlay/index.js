import { forwardRef, cloneElement, useRef, useState } from 'react';
import { cl as classNames } from 'common/utils';
import PropTypes from 'common/prop-types';
import usePopperMarginModifiers from '../usePopperMarginModifiers';
import usePopper from 'common/hooks/usePopper';
import useMergedRefs from 'common/hooks/useMergedRefs';
import useRootClose from '../useRootClose';
import Fade from '../fade';
import { BodyMount } from 'common/ui/mount';
import { OverlayProvider } from './useOverlayContext';

const propTypes = {
  /**
   * Control how much space there is between the edge of the boundary element and overlay.
   * A convenience shortcut to setting `popperConfig.modfiers.preventOverflow.padding`
   */
  containerPadding: PropTypes.number,
  /**
   * A component instance, DOM node, ref, or function that returns either.
   * The overlay will be positioned in relation to the `target`
   */
  target: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.elementType,
    PropTypes.func,
    PropTypes.ref,
  ]).isRequired,
  /**
   * Set the visibility of the Overlay
   */
  show: PropTypes.bool,
  /**
   * Enables the Popper.js `flip` modifier, allowing the Overlay to
   * automatically adjust it's placement in case of overlap with the viewport or toggle.
   * Refer to the [flip docs](https://popper.js.org/popper-documentation.html#modifiers..flip.enabled) for more info
   */
  flip: PropTypes.bool,
  /**
   * Specify whether the overlay should trigger onHide when the user clicks outside the overlay
   */
  rootClose: PropTypes.bool,
  /**
   * Specify event for triggering a "root close" toggle.
   */
  rootCloseEvent: PropTypes.oneOf([ 'click', 'mousedown' ]),
  /**
   * Specify disabled for disable RootCloseWrapper
   */
  rootCloseDisabled: PropTypes.bool,
  /**
   * A callback invoked by the overlay when it wishes to be hidden. Required if
   * `rootClose` is specified.
   */
  onHide: PropTypes.func,
  /**
   * Animate the entering and exiting of the Overlay. `true` will use the `<Fade>` transition,
   * or a custom react-transition-group `<Transition>` component can be provided.
   */
  transition: PropTypes.oneOfType([ PropTypes.bool, PropTypes.elementType ]),
  /**
   * Callback fired before the Overlay transitions in
   */
  onEnter: PropTypes.func,
  /**
   * Callback fired as the Overlay begins to transition in
   */
  onEntering: PropTypes.func,
  /**
   * Callback fired after the Overlay finishes transitioning in
   */
  onEntered: PropTypes.func,
  /**
   * Callback fired right before the Overlay transitions out
   */
  onExit: PropTypes.func,
  /**
   * Callback fired as the Overlay begins to transition out
   */
  onExiting: PropTypes.func,
  /**
   * Callback fired after the Overlay finishes transitioning out
   */
  onExited: PropTypes.func,
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

  showClass: PropTypes.string,
};

const defaultProps = {
  transition: Fade,
  rootClose: false,
  show: false,
  placement: 'top',
};

const Overlay = forwardRef(({
  children: overlay,
  flip,
  placement,
  containerPadding = 5,
  transition,
  show,
  target,
  rootClose,
  rootCloseDisabled,
  rootCloseEvent,
  onHide,
  onExit,
  onExiting,
  onEnter,
  onEntering,
  onEntered,
  onExited,
  showClass,
}, outerRef) => {
  const Transition = transition === true ? Fade : transition || null;

  const popperRef = useRef({});
  const [ marginsRef, marginModifiers ] = usePopperMarginModifiers();

  const [ rootElement, attachRef ] = useState();
  const [ arrowElement, attachArrowRef ] = useState();
  const mergedRef = useMergedRefs(attachRef, marginsRef, outerRef);
  const [ exited, setExited ] = useState(!show);

  const { styles, attributes, ...popper } = usePopper(target, rootElement, {
    placement,
    enabled: show,
    modifiers: [
      {
        name: 'eventListeners',
        enabled: !!show,
      },
      containerPadding
        ? {
          name: 'preventOverflow',
          options: { padding: containerPadding },
        }
        : undefined,
      {
        name: 'arrow',
        enabled: !!arrowElement,
        options: { element: arrowElement },
      },
      {
        name: 'flip',
        enabled: !!flip,
      },
      ...marginModifiers,
    ],
  });

  if (show && exited) {
    if (exited) setExited(false);
  } else if (!transition && !exited) {
    setExited(true);
  }

  const handleHidden = (...args) => {
    setExited(true);
    onExited && onExited(...args);
  };

  // Don't un-render the overlay while it's transitioning out.
  const mountOverlay = show || (Transition && !exited);
  useRootClose(rootElement, onHide, {
    disabled: !rootClose || rootCloseDisabled,
    clickTrigger: rootCloseEvent,
  });

  if (!mountOverlay) {
    // Don't bother showing anything if we don't have to.
    return null;
  }

  const overlayProps = {
    ...attributes.popper,
    style: styles.popper,
    ref: mergedRef,
  };

  const arrowProps = {
    ...attributes.arrow,
    style: styles.arrow,
    ref: attachArrowRef,
  };

  const popperProps = Object.assign(popperRef.current, {
    state: popper.state,
    scheduleUpdate: popper.update,
    placement,
    outOfBoundaries: popper.state?.modifiersData.hide?.isReferenceHidden || false,
  });

  let child = cloneElement(overlay, {
    ...overlayProps,
    placement,
    arrowProps,
    popper: popperProps,
    className: classNames(overlay.props.className, !transition && show && showClass),
    style: {
      ...overlay.props.style,
      ...overlayProps.style,
    },
  });

  if (Transition) {
    child = (
      <Transition
        in={show}
        appear
        onExit={onExit}
        onExiting={onExiting}
        onExited={handleHidden}
        onEnter={onEnter}
        onEntering={onEntering}
        onEntered={onEntered}
      >
        {child}
      </Transition>
    );
  }
  return <BodyMount source="Overlay"><OverlayProvider value={{ show, hide: onHide }}>{child}</OverlayProvider></BodyMount>;
});
Overlay.displayName = 'Overlay';
Overlay.propTypes = propTypes;
Overlay.defaultProps = defaultProps;
export default Overlay;
