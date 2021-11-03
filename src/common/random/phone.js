
import Number from './number';
import { r, Padded, Picker } from './_utils';

import phoneExchanges from 'faker/lib/locales/en_US/phone_number/area_code';
const Exchange = Picker(phoneExchanges);

export default function PhoneNumber () {
  const num = Padded(Number(0, 9999), -4);
  return () => `(${r(Exchange)}) ${r(Exchange)}-${r(num)}`;
}
