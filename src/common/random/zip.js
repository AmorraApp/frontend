
import zipByState from 'faker/lib/locales/en_US/address/postcode_by_state';
import Number from './number';
import { Picker, Padded } from './_utils';

export default function ZipCode (state = null, plus4 = false) {
  let five;
  if (state && typeof state === 'string') {
    const { min, max } = zipByState[state];
    five = Number(min, max);
  } else {
    state = Picker(zipByState);
    five = () => {
      const { min, max } = state();
      return Number(min, max)();
    };
  }

  five = Padded(five, -5);
  const four = Padded(Number(0, 9999), -4);
  return () => five() + (plus4 ? '-' + four() : '');
}
