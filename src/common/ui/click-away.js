
import { useRef, useEffect, Children, cloneElement } from 'react';
import useMergedRefs from 'common/hooks/useMergedRefs';
import useEventCallback from 'common/hooks/useEventCallback';

export default function ClickAwayListener ({
  children,
  disableReactTree = false,
  mouseEvent = 'onClick',
  onClickAway,
  touchEvent = 'onTouchEnd',
}) {

  const child = Children.only(children);

  const movedRef = useRef(false);
  const nodeRef = useRef(null);
  const activatedRef = useRef(false);
  const syntheticEventRef = useRef(false);
  useEffect(() => {
    // Ensure that this component is not "activated" synchronously.
    // https://github.com/facebook/react/issues/20074
    setTimeout(() => {
      activatedRef.current = true;
    }, 0);
    return () => {
      activatedRef.current = false;
    };
  }, []);

  const handleRef = useMergedRefs(nodeRef, child.ref);

  // The handler doesn't take event.defaultPrevented into account:
  //
  // event.preventDefault() is meant to stop default behaviors like
  // clicking a checkbox to check it, hitting a button to submit a form,
  // and hitting left arrow to move the cursor in a text input etc.
  // Only special HTML elements have these default behaviors.
  const handleClickAway = useEventCallback((event) => {
    // Given developers can stop the propagation of the synthetic event,
    // we can only be confident with a positive value.
    const insideReactTree = syntheticEventRef.current;
    syntheticEventRef.current = false;

    const doc = nodeRef.current?.ownerDocument || document;
    // 1. IE11 support, which trigger the handleClickAway even after the unbind
    // 2. The child might render null.
    // 3. Behave like a blur listener.
    if (!activatedRef.current ||
      !nodeRef.current ||
      ('clientX' in event && clickedRootScrollbar(event, doc))) {
      return;
    }
    // Do not act if user performed touchmove
    if (movedRef.current) {
      movedRef.current = false;
      return;
    }
    let insideDOM;
    // If not enough, can use https://github.com/DieterHolvoet/event-propagation-path/blob/master/propagationPath.js
    if (event.composedPath) {
      insideDOM = event.composedPath().indexOf(nodeRef.current) > -1;
    } else {
      insideDOM = !doc.documentElement.contains(event.target) || nodeRef.current.contains(event.target);
    }
    if (!insideDOM && (disableReactTree || !insideReactTree)) {
      onClickAway(event);
    }
  });

  // Keep track of mouse/touch events that bubbled up through the portal.
  const createHandleSynthetic = (handlerName) => (event) => {
    syntheticEventRef.current = true;
    const childrenPropsHandler = children.props[handlerName];
    if (childrenPropsHandler) {
      childrenPropsHandler(event);
    }
  };

  const childrenProps = { ref: handleRef };
  if (touchEvent !== false) {
    childrenProps[touchEvent] = createHandleSynthetic(touchEvent);
  }

  useEffect(() => {
    if (touchEvent !== false) {
      const mappedTouchEvent = mapEventPropToEvent(touchEvent);
      const doc = nodeRef.current?.ownerDocument || document;
      const handleTouchMove = () => {
        movedRef.current = true;
      };
      doc.addEventListener(mappedTouchEvent, handleClickAway);
      doc.addEventListener('touchmove', handleTouchMove);
      return () => {
        doc.removeEventListener(mappedTouchEvent, handleClickAway);
        doc.removeEventListener('touchmove', handleTouchMove);
      };
    }
    return undefined;
  }, [ handleClickAway, touchEvent ]);

  if (mouseEvent !== false) {
    childrenProps[mouseEvent] = createHandleSynthetic(mouseEvent);
  }

  useEffect(() => {
    if (mouseEvent !== false) {
      const mappedMouseEvent = mapEventPropToEvent(mouseEvent);
      const doc = nodeRef.current?.ownerDocument || document;
      doc.addEventListener(mappedMouseEvent, handleClickAway);
      return () => {
        doc.removeEventListener(mappedMouseEvent, handleClickAway);
      };
    }
    return undefined;
  }, [ handleClickAway, mouseEvent ]);

  return cloneElement(children, childrenProps);
}

function clickedRootScrollbar (event, doc) {
  return (doc.documentElement.clientWidth < event.clientX ||
    doc.documentElement.clientHeight < event.clientY);
}

function mapEventPropToEvent (eventProp) {
  return eventProp.substring(2).toLowerCase();
}
