
import { Concat, If, Picker } from './_utils';
import { FirstName, LastName } from './name';
import Bool from './boolean';

import cityPrefix from 'faker/lib/locales/en/address/city_prefix';
import citySuffix from 'faker/lib/locales/en/address/city_suffix';
export const CityPrefix = Picker(cityPrefix);
export const CitySuffix = Picker(citySuffix);
export const CityName = Picker([ FirstName, LastName ]);

export default function City () {
  return Concat(
    If(Bool(20), Concat(CityPrefix, ' ')),
    CityName,
    CitySuffix,
  );
}
