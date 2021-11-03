
import PropTypes from 'common/prop-types';
import { useRef, useCallback, useEffect } from 'react';
import { useGoogleApi } from './ApiProvider';
import useMapContext from './MapContext';
import useMemoObject from 'common/hooks/useMemoObject';
import useSmartEffect from 'common/hooks/useSmartEffect';
import useUpdatedRef from 'common/hooks/useUpdatedRef';

const eventNames = {
  onClick: 'click',
  onDoubleClick: 'dblclick',
  onDragEnd: 'dragend',
  onMouseDown: 'mousedown',
  onMouseOut: 'mouseout',
  onMouseOver: 'mouseover',
  onMouseup: 'mouseup',
  onRecenter: 'recenter',
};

const Marker = ({
  position,
  lat,
  long: lng,
  title,
  icon,
  zIndex,
  label,
  opacity,
  animation,
  anchorPoint,
  cursor,
  clickable,
  draggable,
  shape,
  eventValue,

  onClick,
  onDoubleClick,
  onDragEnd,
  onMouseDown,
  onMouseOut,
  onMouseOver,
  onMouseup,
  onRecenter,

  hide,
}) => {
  const { map } = useMapContext();
  const google = useGoogleApi();
  const eventValueRef = useUpdatedRef(eventValue);

  const eventHandlers = {
    onClick,
    onDoubleClick,
    onDragEnd,
    onMouseDown,
    onMouseOut,
    onMouseOver,
    onMouseup,
    onRecenter,
  };
  const handleEvent = useCallback((name, ...args) => {
    if (typeof eventHandlers[name] === 'function') eventHandlers[name](eventValueRef.current, ...args);
  });

  const markerOptions = {
    position: position || { lat, lng },
    title,
    zIndex,
    icon: useMemoObject(icon),
    label: useMemoObject(label),
    shape,
    draggable,
    opacity,
    animation: google.maps.Animation[animation],
    anchorPoint: useMemoObject(anchorPoint),
    cursor,
    clickable: clickable || !!onClick,
    map: !hide,
  };

  const markerRef = useRef();
  const { current: listeners } = useRef({});

  useEffect(() => {
    markerRef.current = new google.maps.Marker({
      ...markerOptions,
      map: hide ? null : map || null,
    });
    for (const [ pName, mName ] of Object.entries(eventNames)) {
      if (eventHandlers[pName]) {
        listeners[mName] = markerRef.current.addListener(mName, (ev) => handleEvent(pName, ev));
      }
    }

    return () => {
      for (const l of Object.values(listeners)) {
        google.maps.event.removeListener(l);
      }
      markerRef.current.setMap(null);
      markerRef.current = null;
    };
  }, []);

  useSmartEffect(() => {
    if (!markerRef.current) return;
    markerRef.current.setOptions({
      ...markerOptions,
      map: hide ? null : map || null,
    });
  }, markerOptions, true);

  return null;
};
Marker.displayName = 'GoogleMapMarker';
Marker.propTypes = {
  position: PropTypes.object,
  lat: PropTypes.number,
  long: PropTypes.number,
  title: PropTypes.string,
  icon: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
  ]),
  zIndex: PropTypes.number,
  label: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
  ]),
  shape: PropTypes.object,
  draggable: PropTypes.bool,
  clickable: PropTypes.bool,
  opacity: PropTypes.number,
  animation: PropTypes.oneOf([ 'BOUNCE', 'DROP' ]),
  anchorPoint: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
  }),
  cursor: PropTypes.string,

  eventValue: PropTypes.any,

  onClick: PropTypes.func,
  onDoubleClick: PropTypes.func,
  onDragEnd: PropTypes.func,
  onMouseDown: PropTypes.func,
  onMouseOut: PropTypes.func,
  onMouseOver: PropTypes.func,
  onMouseup: PropTypes.func,
  onRecenter: PropTypes.func,

  hide: PropTypes.bool,
};

export default Marker;
