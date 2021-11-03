
import { FirstName, LastName } from './name';
import { Picker, Concat, Join } from './_utils';
import Number from './number';

import streetSuffix from 'faker/lib/locales/en/address/street_suffix';
export const StreetSuffix = Picker(streetSuffix);


export const StreetNumber = Picker([
  Number(100, 999),
  Number(1000, 9999),
  Concat(1, Number(Number(0, 9999))),
]);

export const StreetName = Picker([
  FirstName,
  LastName,
]);

export default function StreetAddress () {
  return Join(' ', StreetNumber, StreetName, StreetSuffix);
}
