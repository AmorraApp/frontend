
import firstNames from 'faker/lib/locales/en/name/first_name';
import maleNames from 'faker/lib/locales/en/name/male_first_name';
import femaleNames from 'faker/lib/locales/en/name/female_first_name';
import lastNames from 'faker/lib/locales/en/name/last_name';
import prefixes from 'faker/lib/locales/en/name/prefix';
import suffixes from 'faker/lib/locales/en/name/suffix';
import Bool from './boolean';
import { If, Picker, Join } from './_utils';

export const FirstName = Picker(firstNames);
export const LastName = Picker(lastNames);
export const Male = Picker(maleNames);
export const Female = Picker(femaleNames);
export const Prefix = Picker(prefixes);
export const Suffix = Picker(suffixes);

function GenderedFirstName (gender) {
  switch (gender && String(gender).toUpperCase()) {
  case 'M':
  case 'MALE':
    return Male;
  case 'F':
  case 'FEMALE':
    return Female;
  default:
    return FirstName;
  }
}

export default function Name ({ length = 2, gendered = null, suffix = false, prefix = false } = {}) {
  const FName = GenderedFirstName(gendered);
  return Join(' ',
    If(prefix, Bool(prefix), Prefix),
    FName,
    length >= 3 && FName,
    length >= 4 && FName,
    length >= 2 && LastName,
    If(suffix, Bool(suffix), Suffix),
  );
}
