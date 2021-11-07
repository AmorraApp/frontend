import PropTypes from 'prop-types';
import { cl } from 'common/utils';
import styles from './address.scss';

export default function AddressOutput ({ className, style, address, address2, city, state, zip, zipPlus4 }) {
  return (
    <div className={cl(className, styles.address)} style={style}>
      <span className={styles['address-street']}>{address}</span>
      {address2 && <span className={styles['address-street']}>{address2}</span>}
      {!!city && <span className={styles['address-city']}>{city}</span>}
      <span className={styles['address-state']}>{state}</span>
      <span className={styles['address-zip']}>{zip}{zipPlus4 && zipPlus4 !== '0000' && `-${zipPlus4}`}</span>
    </div>
  );
}
AddressOutput.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  address: PropTypes.string,
  address2: PropTypes.string,
  city: PropTypes.string,
  state: PropTypes.string,
  zip: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  zipPlus4: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
};
