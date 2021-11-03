
import PropTypes from 'common/prop-types';
import { useRef, useCallback, useEffect } from 'react';
import { useGoogleApi } from './ApiProvider';
import useMapContext from './MapContext';
import { createPortal } from 'react-dom';
import useSmartEffect from 'common/hooks/useSmartEffect';

const eventNames = {
  onClose: 'closeclick',
};

const InfoWindow = ({
  children,

  position,
  lat,
  long: lng,

  maxWidth,
  minWidth,
  pixelOffset,
  zIndex,
  disableAutoPan,

  onClose,

  hide,
}) => {
  const { map } = useMapContext();
  const google = useGoogleApi();

  const eventHandlers = {
    onClose,
  };
  const handleEvent = useCallback((name, ...args) => {
    if (typeof eventHandlers[name] === 'function') eventHandlers[name](...args);
  });

  const domRef = useRef(document.createElement('div'));

  const options = {
    position: position || { lat, lng },
    maxWidth,
    minWidth,
    pixelOffset,
    zIndex,
    disableAutoPan,
    content: domRef.current,
    map: !hide,
  };

  const gRef = useRef();
  const { current: listeners } = useRef({});

  useEffect(() => {
    gRef.current = new google.maps.InfoWindow({
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

  return createPortal(<>{children}</>, domRef.current);
};
InfoWindow.displayName = 'GoogleMapInfoWindow';
InfoWindow.propTypes = {
  position: PropTypes.object,
  lat: PropTypes.number,
  long: PropTypes.number,

  maxWidth: PropTypes.number,
  minWidth: PropTypes.number,
  pixelOffset: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
    widthUnit: PropTypes.string,
    heightUnit: PropTypes.string,
  }),
  zIndex: PropTypes.number,
  disableAutoPan: PropTypes.bool,

  onClose: PropTypes.func,

  hide: PropTypes.bool,
};

export default InfoWindow;
