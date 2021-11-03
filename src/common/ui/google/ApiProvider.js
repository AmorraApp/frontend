
import PropTypes from 'common/prop-types';
import { createContext, useContext, useState, useEffect } from 'react';

export const GoogleApiContext = createContext(null);
GoogleApiContext.displayName = 'GoogleApiContext';

export function useGoogleApi () {
  return useContext(GoogleApiContext);
}

export const GoogleApiProvider = ({ key, libraries, children }) => {
  if (useContext(GoogleApiContext)) return children;

  const [ loaded, setLoaded ] = useState(!!window.google?.maps);
  const google = window.google || {};
  google.key = key;

  useEffect(() => {
    if (loaded) return;

    const callback = 'cb' + Math.floor(Math.random() * 100);
    window[callback] = () => {
      setLoaded(true);
      delete window[callback];
    };
    var script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?libraries=${libraries.join(',')}&key=${key}&v=weekly&callback=${callback}`;
    script.async = true;
    document.head.appendChild(script);
  }, []);

  return (
    <GoogleApiContext.Provider value={loaded && google}>
      {loaded && children}
    </GoogleApiContext.Provider>
  );
};
GoogleApiProvider.defaultProps = {
  key: window.google_api_key || '',
  libraries: [
    'geometry',
    'places',
  ],
};
GoogleApiProvider.propTypes = {
  key: PropTypes.string,
  libraries: PropTypes.arrayOf(PropTypes.string),
};
