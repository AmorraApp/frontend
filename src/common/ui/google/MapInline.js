
import PropTypes from 'common/prop-types';
import { useGoogleApi } from './ApiProvider';
import useMapContext from './MapContext';

const Inline = ({
  children,
  ...props
}) => {
  const { map, places } = useMapContext();
  const google = useGoogleApi();

  if (typeof children === 'function') {
    return children({ ...props, map, google, places }) || null;
  }
  return null;
};
Inline.displayName = 'GoogleMapInline';
Inline.propTypes = {
  children: PropTypes.func,
};

export default Inline;
