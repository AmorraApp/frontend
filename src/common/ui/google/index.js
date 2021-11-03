
export { GoogleApiProvider, useGoogleApi } from './ApiProvider';
export { default as MapContext } from './MapContext';
export * from './hooks';

import GoogleMap from './Map';
import Marker from './MapMarker';
import Overlay from './MapOverlay';
import Circle from './MapCircle';
import Rectangle from './MapRectangle';
import InfoWindow from './MapWindow';
import Place from './Place';
import Inline from './MapInline';

GoogleMap.Marker = Marker;
GoogleMap.Overlay = Overlay;
GoogleMap.Circle = Circle;
GoogleMap.Rectangle = Rectangle;
GoogleMap.InfoWindow = InfoWindow;
GoogleMap.Place = Place;
GoogleMap.Inline = Inline;
export default GoogleMap;
