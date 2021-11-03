
import PropTypes from 'common/prop-types';
import { cl as classNames } from 'common/utils';
import { forwardRef, useRef, useEffect, useCallback, useState } from 'react';
import { useGoogleApi } from './ApiProvider';
import useMemoObject from 'common/hooks/useMemoObject';
import useMergedRefs from 'common/hooks/useMergedRefs';
import useUpdateEffect from 'common/hooks/useUpdateEffect';
import * as styles from './googlemap.scss';

import { MapContext } from './MapContext';

const eventNames = {
  'onReady':              'ready',
  'onClick':              'click',
  'onDragend':            'dragend',
  'onRecenter':           'recenter',
  'onBoundsChanged':      'bounds_changed',
  'onCenterChanged':      'center_changed',
  'onDoubleClick':        'dblclick',
  'onDragstart':          'dragstart',
  'onHeadingChange':      'heading_change',
  'onIdle':               'idle',
  'onMapTypeChanged':     'maptypeid_changed',
  'onMouseMove':          'mousemove',
  'onMouseOut':           'mouseout',
  'onMouseOver':          'mouseover',
  'onProjectionChanged':  'projection_changed',
  'onResize':             'resize',
  'onRightClick':         'rightclick',
  'onTilesLoaded':        'tilesloaded',
  'onTiltChanged':        'tilt_changed',
  'onZoomChanged':        'zoom_changed',
};

const GoogleMap = forwardRef(({
  className,
  children,

  position,
  lat,
  long: lng,

  panControl,
  panControlPosition,
  fullscreenControl,
  fullscreenControlPosition,
  streetViewControl,
  streetViewControlPosition,
  zoomControl,
  zoomControlPosition,
  rotateControl,
  mapTypeControl,
  mapTypeControlStyle,
  mapTypeControlPosition,
  mapTypes,
  scaleControl,
  scaleControlPosition,
  clickableIcons,
  disableDoubleClickZoom,
  zoom,
  maxZoom,
  minZoom,
  gestureHandling,
  restriction,
  features,

  onReady,
  onClick,
  onDragend,
  onRecenter,
  onBoundsChanged,
  onCenterChanged,
  onDoubleClick,
  onDragstart,
  onHeadingChange,
  onIdle,
  onMapTypeChanged,
  onMouseMove,
  onMouseOut,
  onMouseOver,
  onProjectionChanged,
  onResize,
  onRightClick,
  onTilesLoaded,
  onTiltChanged,
  onZoomChanged,

  ...props
}, ref) => {

  const google = useGoogleApi();
  if (!google) return;

  const [ map, setMap ] = useState();
  const placesRef = useRef();
  const mapContainerRef = useRef();
  ref = useMergedRefs(mapContainerRef, ref);
  const { current: listeners } = useRef({});

  const eventHandlers = {
    onReady,
    onClick,
    onDragend,
    onRecenter,
    onBoundsChanged,
    onCenterChanged,
    onDoubleClick,
    onDragstart,
    onHeadingChange,
    onIdle,
    onMapTypeChanged,
    onMouseMove,
    onMouseOut,
    onMouseOver,
    onProjectionChanged,
    onResize,
    onRightClick,
    onTilesLoaded,
    onTiltChanged,
    onZoomChanged,
  };
  const handleEvent = useCallback((name, ...args) => {
    if (typeof eventHandlers[name] === 'function') eventHandlers[name](...args);
  });


  useEffect(() => {
    if (restriction) {
      const { strict: strictRestrict, ...r } = restriction;
      restriction = { latLngBounds: r, strictBounds: strictRestrict };
    }

    const newMap = new google.maps.Map(mapContainerRef.current, {
      center: position || { lat, lng },
      panControl,
      panControlOptions: {
        position: google.maps.ControlPosition[panControlPosition],
      },
      fullscreenControl,
      fullscreenControlOptions: {
        position: google.maps.ControlPosition[fullscreenControlPosition],
      },
      streetViewControl,
      streetViewControlOptions: (
        streetViewControlPosition
          ? { position: google.maps.ControlPosition[streetViewControlPosition] }
          : null
      ),
      zoomControl,
      zoomControlOptions: {
        position: google.maps.ControlPosition[zoomControlPosition],
      },
      rotateControl,
      mapTypeControl,
      mapTypeControlOptions: {
        mapTypeIds: mapTypes.map((t) => google.maps.MapTypeId[t]),
        position: google.maps.ControlPosition[mapTypeControlPosition],
        style: google.maps.MapTypeControlStyle[mapTypeControlStyle],
      },
      scaleControl,
      scaleControlOptions: {
        position: google.maps.ControlPosition[scaleControlPosition],
      },
      zoom,
      maxZoom,
      minZoom,
      gestureHandling,
      restriction,
      clickableIcons,
      disableDoubleClickZoom,
      styles: features,
    });

    for (const [ pName, mName ] of Object.entries(eventNames)) {
      listeners[mName] = newMap.addListener(mName, (ev) => handleEvent(pName, ev));
    }

    setMap(newMap);
    placesRef.current = new google.maps.places.PlacesService(newMap);

    // on unmount
    return () => {
      placesRef.current = null;
      for (const l of Object.values(listeners)) {
        google.maps.event.removeListener(l);
      }
      setMap(null);
    };
  }, []);

  useUpdateEffect(() => {
    map.panTo(position || { lat, lng });
    map.setZoom(zoom);
  }, [ position, lat, lng, zoom ]);

  const context = useMemoObject({
    map,
    places: placesRef.current,
  });

  return (
    <MapContext.Provider value={context}>
      <div className={classNames(className, styles.googlemap)} {...props}>
        <div ref={ref} className={styles.mapContainer} />
        {map ? children : null}
      </div>
    </MapContext.Provider>
  );
});
GoogleMap.displayName = 'GoogleMap';
GoogleMap.defaultProps = {
  lat: 0,
  long: 0,
  panControl: false,
  panControlPosition: 'TOP_LEFT',
  fullscreenControl: false,
  fullscreenControlPosition: 'RIGHT_TOP',
  streetViewControl: false,
  streetViewControlPosition: null,
  zoomControl: true,
  zoomControlPosition: 'RIGHT_TOP',
  rotateControl: false,
  mapTypeControl: false,
  mapTypeControlStyle: 'HORIZONTAL_BAR',
  mapTypeControlPosition: 'TOP_RIGHT',
  mapTypes: [
    'ROADMAP',
    'SATELLITE',
  ],
  scaleControl: false,
  scaleControlPosition: 'BOTTOM_RIGHT',
  zoom: 14,
  maxZoom: null,
  minZoom: null,
  gestureHandling: 'auto',
  restriction: null,
  clickableIcons: false,
  disableDoubleClickZoom: false,
  features: [
    {
      "featureType": "administrative.land_parcel",
      "stylers": [
        { "visibility": "on" },
        { color: "#0FA1FF" },
        { weight: 1.5 },
      ],
    },
    {
      "featureType": "poi",
      "elementType": "labels.text",
      "stylers": [ { "visibility": "off" } ],
    },
    {
      "featureType": "poi.business",
      "stylers": [ { "visibility": "off" } ],
    },
    {
      "featureType": "poi.park",
      "stylers": [ { "visibility": "on" } ],
    },
    {
      "featureType": "road",
      "elementType": "labels.icon",
      "stylers": [ { "visibility": "off" } ],
    },
    {
      "featureType": "transit",
      "stylers": [ { "visibility": "off" } ],
    },
  ],
};

const ControlPositions = [
  'TOP_CENTER',
  'TOP_LEFT',
  'TOP_RIGHT',
  'LEFT_TOP',
  'RIGHT_TOP',
  'LEFT_CENTER',
  'RIGHT_CENTER',
  'LEFT_BOTTOM',
  'RIGHT_BOTTOM',
  'BOTTOM_CENTER',
  'BOTTOM_LEFT',
  'BOTTOM_RIGHT',
];

GoogleMap.propTypes = {
  position: PropTypes.exact({
    lat: PropTypes.number,
    lng: PropTypes.number,
  }),
  lat: PropTypes.number,
  long: PropTypes.number,
  panControl: PropTypes.bool,
  panControlPosition: PropTypes.oneOf(ControlPositions),
  fullscreenControl: PropTypes.bool,
  fullscreenControlPosition: PropTypes.oneOf(ControlPositions),
  streetViewControl: PropTypes.bool,
  streetViewControlPosition: PropTypes.oneOf(ControlPositions),
  zoomControl: PropTypes.bool,
  zoomControlPosition: PropTypes.oneOf(ControlPositions),
  rotateControl: PropTypes.bool,
  mapTypeControl: PropTypes.bool,
  mapTypeControlStyle: PropTypes.oneOf([
    'DEFAULT',
    'HORIZONTAL_BAR',
    'DROPDOWN_MENU',
  ]),
  mapTypeControlPosition: PropTypes.oneOf(ControlPositions),
  mapTypes: PropTypes.arrayOf(PropTypes.oneOf([
    'ROADMAP',
    'HYBRID',
    'SATELLITE',
    'TERRAIN',
  ])),
  scaleControl: PropTypes.bool,
  scaleControlPosition: PropTypes.oneOf(ControlPositions),
  zoom: PropTypes.number,
  maxZoom: PropTypes.number,
  minZoom: PropTypes.number,
  restriction: PropTypes.shape({
    north: PropTypes.number,
    south: PropTypes.number,
    west:  PropTypes.number,
    east:  PropTypes.number,
    strict: PropTypes.bool,
  }),
  clickableIcons: PropTypes.bool,
  disableDoubleClickZoom: PropTypes.bool,
  gestureHandling: PropTypes.oneOf([
    'cooperative',
    'greedy',
    'none',
    'auto',
  ]),
  features: PropTypes.arrayOf(PropTypes.object),

  onReady: PropTypes.func,
  onClick: PropTypes.func,
  onDragend: PropTypes.func,
  onRecenter: PropTypes.func,
  onBoundsChanged: PropTypes.func,
  onCenterChanged: PropTypes.func,
  onDoubleClick: PropTypes.func,
  onDragstart: PropTypes.func,
  onHeadingChange: PropTypes.func,
  onIdle: PropTypes.func,
  onMapTypeChanged: PropTypes.func,
  onMouseMove: PropTypes.func,
  onMouseOut: PropTypes.func,
  onMouseOver: PropTypes.func,
  onProjectionChanged: PropTypes.func,
  onResize: PropTypes.func,
  onRightClick: PropTypes.func,
  onTilesLoaded: PropTypes.func,
  onTiltChanged: PropTypes.func,
  onZoomChanged: PropTypes.func,
};

export default GoogleMap;
