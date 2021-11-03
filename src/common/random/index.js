/* eslint new-cap: 0 */

export { default as Age } from './age';
export { default as Bool } from './boolean';
export { default as City } from './city';
export { default as Gender } from './gender';
export { default as Number } from './number';
export { default as Currency } from './currency';
export { default as Name, FirstName, LastName } from './name';
export { default as Phone } from './phone';
export { default as Sex } from './sex';
export { default as State } from './state';
export { default as StreetAddress } from './streetaddress';
export { default as ZipCode } from './zip';
export * from './_utils';

import * as Utils from './_utils';
import Age from './age';
import Bool from './boolean';
import City from './city';
import Gender from './gender';
import Number from './number';
import Currency from './currency';
import Name, { FirstName, LastName } from './name';
import Phone from './phone';
import Sex from './sex';
import State from './state';
import StreetAddress from './streetaddress';
import ZipCode from './zip';
import Startup from './startup';

export default {
  ...Utils,
  Age,
  Bool,
  City,
  Gender,
  Number,
  Currency,
  Name,
  FirstName,
  LastName,
  Startup,
  Phone,
  Sex,
  State,
  StreetAddress,
  ZipCode,
};

