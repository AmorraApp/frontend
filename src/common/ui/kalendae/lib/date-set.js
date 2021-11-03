
import {
  startOfDay,
} from 'date-fns';

export default class DateSet {

  constructor (dates) {
    this._map = new Map(dates ? dates.map((d) => [ hash(d), d ]) : []);
  }

  get size () {
    return this._map.size;
  }

  map (predicate) {
    return Array.from(this._map.entries(),
      ([ key, value ], index) => predicate(value, key, index, this),
    );
  }


  reduce (predicate, initial) {
    let index = 0;
    for (const [ key, value ] of this._map.entries()) {
      initial = predicate(initial, value, key, index++, this);
    }
    return initial;
  }

  has (date) {
    return this._map.has(hash(date));
  }

  add (date) {
    this._map.set(hash(date), date);
    return this;
  }

  delete (date) {
    this._map.delete(hash(date));
    return this;
  }

}

const PASSTHRU = [
  'clear', 'entries', 'forEach', 'keys', 'values', Symbol.iterator,
];

for (const alias of PASSTHRU) {
  DateSet.prototype[alias] = function (...args) { return this._map[alias](...args); };
}

function hash (day) {
  return startOfDay(day).toJSON();
}
