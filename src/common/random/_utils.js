
import { range, truthy, isFunction, isObject, isArray, mapValues } from 'common/utils';

const truthyOrZero = (i) => truthy(i) || i === 0;

export function r (fn) {
  if (isFunction(fn)) return r(fn());
  if (isArray(fn)) return fn.map(r);
  if (isObject(fn, true)) return mapValues(fn, r);
  return fn;
}

export function Resolver (input) {
  return () => r(input);
}

export function If (...input) {
  return () => {
    let value;
    for (value of input) {
      value = r(value);

      if (!truthyOrZero(value)) {
        return false;
      }
    }
    return value;
  };
}

export function Collection (length, datamap) {
  return () => range(0, length, Resolver(datamap));
}

export function Tern (condition, t, f) {
  return () => (r(condition) ? r(t) : r(f));
}

export function Picker (items) {
  if (isArray(items)) return () => items[ ~~(Math.random() * items.length) ];
  if (isObject(items)) {
    return Picker(Object.values(items));
  }
}

export function Concat (...items) {
  return () => items.map(r).filter(truthyOrZero).join('');
}

export function Join (delimiter, ...items) {
  return () => items.map(r).filter(truthyOrZero).join(delimiter);
}


export function Padded (fn, length, padding = '0') {
  const mut = length < 0
    ? (s) => s.padStart(Math.abs(length), padding)
    : (s) => s.padEnd(length, padding)
  ;

  return () => mut(String(r(fn)));
}
