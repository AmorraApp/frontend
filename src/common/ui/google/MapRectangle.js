
import PropTypes from 'common/prop-types';
import { useRef, useCallback, useEffect } from 'react';
import { useGoogleApi } from './ApiProvider';
import useMapContext from './MapContext';
import useSmartEffect from 'common/hooks/useSmartEffect';

const eventNames = {
  onClick: 'click',
  onDoubleClick: 'dblclick',
  onDragEnd: 'dragend',
  onMouseDown: 'mousedown',
  onMouseOut: 'mouseout',
  onMouseOver: 'mouseover',
  onMouseup: 'mouseup',
};

const Rectangle = ({
  north,
  east,
  south,
  west,

  strokeColor,
  strokeOpacity,
  strokeWeight,
  strokePosition,
  fillColor,
  fillOpacity,
  draggable,
  clickable,

  onClick,
  onDoubleClick,
  onDragEnd,
  onMouseDown,
  onMouseOut,
  onMouseOver,
  onMouseup,

  hide,
}) => {
  const { map } = useMapContext();
  const google = useGoogleApi();

  const eventHandlers = {
    onClick,
    onDoubleClick,
    onDragEnd,
    onMouseDown,
    onMouseOut,
    onMouseOver,
    onMouseup,
  };
  const handleEvent = useCallback((name, ...args) => {
    if (typeof eventHandlers[name] === 'function') eventHandlers[name](...args);
  });

  const options = {
    bounds: [
      { lat: south, lng: west },
      { lat: north, lng: east },
    ],
    strokeColor,
    strokeOpacity,
    strokeWeight,
    strokePosition: google.maps.StrokePosition[strokePosition],
    fillColor,
    fillOpacity,
    draggable,
    clickable: clickable || !!onClick,
    map: !hide,
  };

  const gRef = useRef();
  const { current: listeners } = useRef({});

  useEffect(() => {
    gRef.current = new google.maps.Rectangle({
      ...options,
      map: hide ? null : map || null,
    });
    for (const [ pName, mName ] of Object.entries(eventNames)) {
      if (eventHandlers[pName]) {
        listeners[mName] = gRef.current.addListener(mName, (ev) => handleEvent(pName, ev));
      }
    }

    return () => {
      for (const l of Object.values(listeners)) {
        google.maps.event.removeListener(l);
      }
      gRef.current.setMap(null);
      gRef.current = null;
    };
  }, []);

  useSmartEffect(() => {
    if (!gRef.current) return;
    gRef.current.setOptions({
      ...options,
      map: hide ? null : map || null,
    });
  }, options, true);

  return null;
};
Rectangle.displayName = 'GoogleMapRectangle';
Rectangle.propTypes = {
  lat: PropTypes.number,
  long: PropTypes.number,

  radius: PropTypes.number,
  strokeColor: PropTypes.string,
  strokeOpacity: PropTypes.number,
  strokeWeight: PropTypes.string,
  strokePosition: PropTypes.oneOf([ 'CENTER', 'INSIDE', 'OUTSIDE' ]),
  fillColor: PropTypes.string,
  fillOpacity: PropTypes.number,

  draggable: PropTypes.bool,
  clickable: PropTypes.bool,

  onClick: PropTypes.func,
  onDoubleClick: PropTypes.func,
  onDragEnd: PropTypes.func,
  onMouseDown: PropTypes.func,
  onMouseOut: PropTypes.func,
  onMouseOver: PropTypes.func,
  onMouseup: PropTypes.func,

  hide: PropTypes.bool,
};

export default Rectangle;
