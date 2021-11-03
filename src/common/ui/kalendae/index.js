
export * from './Kalendae';
export { default as KalendaeInput } from './Input/index.js';

import Kalendae from './Kalendae';
import KalendaeInput from './Input/index.js';
Kalendae.Input = KalendaeInput;

export default Kalendae;
