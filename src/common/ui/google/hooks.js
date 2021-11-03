
import usePromisedState from 'common/hooks/usePromisedState';
import { useGoogleApi } from './ApiProvider';

var geocoder;
export function useGeoCode ({ address, bounds, componentRestrictions, placeId, region }) {
  const google = useGoogleApi();
  if (!geocoder) geocoder = new google.maps.Geocoder();

  const {
    state: { results },
    loading,
  } = usePromisedState(
    () => geocoder.geocode({ address, bounds, componentRestrictions, placeId, region }),
    [ address, bounds, componentRestrictions, placeId, region ],
  );

  return { results, loading };
}
