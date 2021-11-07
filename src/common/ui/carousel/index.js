
import {
  useEventCallback,
  useUpdateEffect,
  useCommittedRef,
  useTimeout,
} from 'common/hooks';
import { cl as classNames } from 'common/utils';
import Transition from 'react-transition-group/Transition';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { useUncontrolled } from 'uncontrollable';
import divWithClassName from '../divWithClassName';

import { map, forEach } from '../../children';
import SafeAnchor from '../safe-anchor';
import triggerBrowserReflow from '../triggerBrowserReflow';
import * as styles from './carousel.scss';

const CarouselCaption = divWithClassName(styles['carousel-caption'], 'CardBody');
const CarouselItem = divWithClassName(styles['carousel-item'], 'CarouselItem');
/*
  The amount of time to delay between automatically cycling this specific item.
  Will default to the Carousel's `interval` prop value if none is specified.
*/
CarouselItem.propTypes.interval = PropTypes.number;

const SWIPE_THRESHOLD = 40;

const transitionEnd = (node, done) => {
  // use the css transitionend event to mark the finish of a transition
  node.addEventListener('transitionend', done, false);
};

const propTypes = {

  className: PropTypes.string,
  as: PropTypes.elementType,

  /**
     * Enables animation on the Carousel as it transitions between slides.
     */
  slide: PropTypes.bool,

  /** Cross fade slides instead of the default slide animation */
  fade: PropTypes.bool,

  /**
     * Show the Carousel previous and next arrows for changing the current slide
     */
  controls: PropTypes.bool,

  /**
     * Show a set of slide position indicators
     */
  indicators: PropTypes.bool,

  /**
     * Controls the current visible slide
     *
     * @controllable onSelect
     */
  activeIndex: PropTypes.number,

  /**
     * Callback fired when the active item changes.
     *
     * ```js
     * (eventKey: number, event: Object | null) => void
     * ```
     *
     * @controllable activeIndex
     */
  onSelect: PropTypes.func,

  /**
     * Callback fired when a slide transition starts.
     *
     * ```js
     * (eventKey: number, direction: 'left' | 'right') => void
     */
  onSlide: PropTypes.func,

  /**
     * Callback fired when a slide transition ends.
     *
     * ```js
     * (eventKey: number, direction: 'left' | 'right') => void
     */
  onSlid: PropTypes.func,

  /**
     * The amount of time to delay between automatically cycling an item. If `null`, carousel will not automatically cycle.
     */
  interval: PropTypes.number,

  /** Whether the carousel should react to keyboard events. */
  keyboard: PropTypes.bool,

  /**
     * If set to `"hover"`, pauses the cycling of the carousel on `mouseenter` and resumes the cycling of the carousel
     * on `mouseleave`. If set to `false`, hovering over the carousel won't pause it.
     *
     * On touch-enabled devices, when set to `"hover"`, cycling will pause on `touchend` (once the user finished
     * interacting with the carousel) for two intervals, before automatically resuming. Note that this is in addition
     * to the above mouse behavior.
     */
  pause: PropTypes.oneOf([ 'hover', false ]),

  /** Whether the carousel should cycle continuously or have hard stops. */
  wrap: PropTypes.bool,

  /**
     * Whether the carousel should support left/right swipe interactions on touchscreen devices.
     */
  touch: PropTypes.bool,

  /** Override the default button icon for the "previous" control */
  prevIcon: PropTypes.node,

  /**
     * Label shown to screen readers only, can be used to show the previous element
     * in the carousel.
     * Set to null to deactivate.
     */
  prevLabel: PropTypes.string,

  /** Override the default button icon for the "next" control */
  nextIcon: PropTypes.node,

  /**
     * Label shown to screen readers only, can be used to show the next element
     * in the carousel.
     * Set to null to deactivate.
     */
  nextLabel: PropTypes.string,

};

const defaultProps = {
  slide: true,
  fade: false,
  controls: true,
  indicators: true,
  defaultActiveIndex: 0,
  interval: 5000,
  keyboard: true,
  pause: 'hover',
  wrap: true,
  touch: true,
  prevIcon: <span aria-hidden="true" className="carousel-control-prev-icon" />,
  prevLabel: 'Previous',
  nextIcon: <span aria-hidden="true" className="carousel-control-next-icon" />,
  nextLabel: 'Next',
};

function isVisible (element) {
  if (!element ||
      !element.style ||
      !element.parentNode ||
      !element.parentNode.style) {
    return false;
  }
  const elementStyle = getComputedStyle(element);
  return (elementStyle.display !== 'none' &&
    elementStyle.visibility !== 'hidden' &&
    getComputedStyle(element.parentNode).display !== 'none');
}
function CarouselFunc (uncontrolledProps, ref) {
  const {
    // Need to define the default "as" during prop destructuring to be compatible with styled-components github.com/react-bootstrap/react-bootstrap/issues/3595
    as: Component = 'div',
    slide,
    fade,
    controls,
    indicators,
    activeIndex,
    onSelect,
    onSlide,
    onSlid,
    interval,
    keyboard,
    onKeyDown,
    pause,
    onMouseOver,
    onMouseOut,
    wrap,
    touch,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    prevIcon,
    prevLabel,
    nextIcon,
    nextLabel,
    className,
    children,
    ...props
  } = useUncontrolled(uncontrolledProps, {
    activeIndex: 'onSelect',
  });

  const nextDirectionRef = useRef(null);
  const [ direction, setDirection ] = useState('next');
  const [ isSliding, setIsSliding ] = useState(false);
  const [ renderedActiveIndex, setRenderedActiveIndex ] = useState(activeIndex || 0);

  if (!isSliding && activeIndex !== renderedActiveIndex) {
    if (nextDirectionRef.current) {
      setDirection(nextDirectionRef.current);
    } else {
      setDirection((activeIndex || 0) > renderedActiveIndex ? 'next' : 'prev');
    }
    if (slide) {
      setIsSliding(true);
    }
    setRenderedActiveIndex(activeIndex || 0);
  }

  useEffect(() => {
    if (nextDirectionRef.current) {
      nextDirectionRef.current = null;
    }
  });
  let numChildren = 0;
  let activeChildInterval;
  // Iterate to grab all of the children's interval values
  // (and count them, too)
  forEach(children, (child, index) => {
    ++numChildren;
    if (index === activeIndex) {
      activeChildInterval = child.props.interval;
    }
  });
  const activeChildIntervalRef = useCommittedRef(activeChildInterval);

  const prev = useCallback((event) => {
    if (isSliding) {
      return;
    }
    let nextActiveIndex = renderedActiveIndex - 1;
    if (nextActiveIndex < 0) {
      if (!wrap) {
        return;
      }
      nextActiveIndex = numChildren - 1;
    }
    nextDirectionRef.current = 'prev';
    if (onSelect) {
      onSelect(nextActiveIndex, event);
    }
  }, [ isSliding, renderedActiveIndex, onSelect, wrap, numChildren ]);

  // This is used in the setInterval, so it should not invalidate.
  const next = useEventCallback((event) => {
    if (isSliding) {
      return;
    }
    let nextActiveIndex = renderedActiveIndex + 1;
    if (nextActiveIndex >= numChildren) {
      if (!wrap) {
        return;
      }
      nextActiveIndex = 0;
    }
    nextDirectionRef.current = 'next';
    if (onSelect) {
      onSelect(nextActiveIndex, event);
    }
  });
  const elementRef = useRef();
  useImperativeHandle(ref, () => ({ element: elementRef.current, prev, next }));

  // This is used in the setInterval, so it should not invalidate.
  const nextWhenVisible = useEventCallback(() => {
    if (!document.hidden && isVisible(elementRef.current)) {
      next();
    }
  });

  const slideDirection = direction === 'next' ? 'left' : 'right';
  useUpdateEffect(() => {
    if (slide) {
      // These callbacks will be handled by the <Transition> callbacks.
      return;
    }
    if (onSlide) {
      onSlide(renderedActiveIndex, slideDirection);
    }
    if (onSlid) {
      onSlid(renderedActiveIndex, slideDirection);
    }
  }, [ renderedActiveIndex ]);
  const orderClassName = styles[`carousel-item-${direction}`];
  const directionalClassName = styles[`carousel-item-${slideDirection}`];

  const handleEnter = useCallback((node) => {
    triggerBrowserReflow(node);
    if (onSlide) {
      onSlide(renderedActiveIndex, slideDirection);
    }
  }, [ onSlide, renderedActiveIndex, slideDirection ]);

  const handleEntered = useCallback(() => {
    setIsSliding(false);
    if (onSlid) {
      onSlid(renderedActiveIndex, slideDirection);
    }
  }, [ onSlid, renderedActiveIndex, slideDirection ]);

  const handleKeyDown = useCallback((event) => {
    if (keyboard && !/input|textarea/i.test(event.target.tagName)) {
      switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        prev(event);
        return;
      case 'ArrowRight':
        event.preventDefault();
        next(event);
        return;
      default:
      }
    }
    if (onKeyDown) {
      onKeyDown(event);
    }
  }, [ keyboard, onKeyDown, prev, next ]);

  const [ pausedOnHover, setPausedOnHover ] = useState(false);

  const handleMouseOver = useCallback((event) => {
    if (pause === 'hover') {
      setPausedOnHover(true);
    }
    if (onMouseOver) {
      onMouseOver(event);
    }
  }, [ pause, onMouseOver ]);

  const handleMouseOut = useCallback((event) => {
    setPausedOnHover(false);
    if (onMouseOut) {
      onMouseOut(event);
    }
  }, [ onMouseOut ]);

  const touchStartXRef = useRef(0);
  const touchDeltaXRef = useRef(0);

  const [ pausedOnTouch, setPausedOnTouch ] = useState(false);

  const touchUnpauseTimeout = useTimeout();

  const handleTouchStart = useCallback((event) => {
    touchStartXRef.current = event.touches[0].clientX;
    touchDeltaXRef.current = 0;
    if (touch) {
      setPausedOnTouch(true);
    }
    if (onTouchStart) {
      onTouchStart(event);
    }
  }, [ touch, onTouchStart ]);

  const handleTouchMove = useCallback((event) => {
    if (event.touches && event.touches.length > 1) {
      touchDeltaXRef.current = 0;
    } else {
      touchDeltaXRef.current =
                event.touches[0].clientX - touchStartXRef.current;
    }
    if (onTouchMove) {
      onTouchMove(event);
    }
  }, [ onTouchMove ]);

  const handleTouchEnd = useCallback((event) => {
    if (touch) {
      const touchDeltaX = touchDeltaXRef.current;
      if (Math.abs(touchDeltaX) <= SWIPE_THRESHOLD) {
        return;
      }
      if (touchDeltaX > 0) {
        prev(event);
      } else {
        next(event);
      }
    }
    touchUnpauseTimeout.set(() => {
      setPausedOnTouch(false);
    }, interval || undefined);
    if (onTouchEnd) {
      onTouchEnd(event);
    }
  }, [ touch, prev, next, touchUnpauseTimeout, interval, onTouchEnd ]);

  const shouldPlay = !!interval && !pausedOnHover && !pausedOnTouch && !isSliding;
  const intervalHandleRef = useRef();

  useEffect(() => {
    if (!shouldPlay) {
      return undefined;
    }
    intervalHandleRef.current = window.setInterval(document.visibilityState ? nextWhenVisible : next, activeChildIntervalRef.current ?? interval ?? undefined);
    return () => {
      if (intervalHandleRef.current !== null) {
        clearInterval(intervalHandleRef.current);
      }
    };
  }, [ shouldPlay, next, activeChildIntervalRef, interval, nextWhenVisible ]);

  const indicatorOnClicks = useMemo(
    () => (
      indicators && Array.from({ length: numChildren }, (_, index) => (event) => {
        if (onSelect) {
          onSelect(index, event);
        }
      })
    ),
    [ indicators, numChildren, onSelect ],
  );

  return (
    <Component
      ref={elementRef}
      {...props}
      onKeyDown={handleKeyDown}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={classNames(className, styles.carousel, slide && styles.slide, fade && styles['carousel-fade'])}
    >
      {indicators && (
        <ol className={styles['carousel-indicators']}>
          {map(children, (_child, index) => (
            <li
              key={index}
              className={index === renderedActiveIndex ? styles.active : undefined}
              onClick={indicatorOnClicks ? indicatorOnClicks[index] : undefined}
            />
          ))}
        </ol>
      )}

      <div className={styles['carousel-inner']}>
        {map(children, (child, index) => {
          const isActive = index === renderedActiveIndex;
          if (slide) {
            return (
              <Transition
                in={isActive}
                onEnter={isActive ? handleEnter : undefined}
                onEntered={isActive ? handleEntered : undefined}
                addEndListener={transitionEnd}
              >
                {(status) => React.cloneElement(child,
                  {
                    className: classNames(
                      child.props.className,
                      isActive && status !== 'entered' && orderClassName,
                      (status === 'entered' || status === 'exiting') && styles.active,
                      (status === 'entering' || status === 'exiting') && directionalClassName,
                    ),
                  },
                )}
              </Transition>
            );
          }

          return React.cloneElement(child, {
            className: classNames(
              child.props.className,
              isActive && 'active',
            ),
          });
        })}
      </div>

      {controls && (<>
        {(wrap || activeIndex !== 0) && (<SafeAnchor className={styles['carousel-control-prev']} onClick={prev}>
          {prevIcon}
          {prevLabel && <span className="sr-only">{prevLabel}</span>}
        </SafeAnchor>)}
        {(wrap || activeIndex !== numChildren - 1) && (<SafeAnchor className={styles['carousel-control-next']} onClick={next}>
          {nextIcon}
          {nextLabel && <span className="sr-only">{nextLabel}</span>}
        </SafeAnchor>)}
      </>)}
    </Component>
  );
}
const Carousel = React.forwardRef(CarouselFunc);
Carousel.displayName = 'Carousel';
Carousel.propTypes = propTypes;
Carousel.defaultProps = defaultProps;
Carousel.Caption = CarouselCaption;
Carousel.Item = CarouselItem;
export default Carousel;