
import PropTypes from 'common/prop-types';
import { useGoogleApi } from './ApiProvider';
import useMapContext from './MapContext';
import usePromisedState from 'common/hooks/usePromisedState';
import useMemoObject from 'common/hooks/useMemoObject';

const Place = ({
  query,
  fields,
  children,
}) => {
  const { places } = useMapContext();
  const google = useGoogleApi();

  const {
    state: { results, status } = {},
    loading,
  } = usePromisedState(
    () => new Promise((resolve) => {
      places.findPlaceFromQuery({ query, fields }, (results, status) => { // eslint-disable-line no-shadow
        switch (status) {
        case google.maps.places.PlacesServiceStatus.INVALID_REQUEST: status = 'INVALID_REQUEST'; break;
        case google.maps.places.PlacesServiceStatus.NOT_FOUND: status = 'NOT_FOUND'; break;
        case google.maps.places.PlacesServiceStatus.OK: status = 'OK'; break;
        case google.maps.places.PlacesServiceStatus.OVER_QUERY_LIMIT: status = 'OVER_QUERY_LIMIT'; break;
        case google.maps.places.PlacesServiceStatus.REQUEST_DENIED: status = 'REQUEST_DENIED'; break;
        case google.maps.places.PlacesServiceStatus.UNKNOWN_ERROR: status = 'UNKNOWN_ERROR'; break;
        case google.maps.places.PlacesServiceStatus.ZERO_RESULTS: status = 'ZERO_RESULTS'; break;
        // no default
        }

        resolve({ results, status });
      });
    }),
    [ query, useMemoObject(fields) ],
  );

  if (typeof children === 'function') {
    const state = {
      results: status === 'OK' && results || [],
      error: (loading ? 'LOADING' : status !== 'OK' && status || null ),
      ready: !loading && status === 'OK',
    };
    return children(state);
  }
  return null;
};
Place.displayName = 'GoogleMapPlace';
Place.propTypes = {
  query: PropTypes.string,
  fields: PropTypes.arrayOf(PropTypes.string),
  children: PropTypes.func,
};

export default Place;
