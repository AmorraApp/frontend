import { observable, action, computed, isObservableMap, isObservableArray, makeObservable } from "mobx";
// import { isPrimitive } from 'common/utils';
import binSearch from 'binary-search';

const READ_ONLY = 'SortedSet is a read-only derived view and cannot be manipulated directly.';

export default class DerivedList {

  constructor (source, { filter = null, sort = null, silent = false }) {
    if (!isObservableMap(source) && !isObservableArray(source)) throw new TypeError('Expected an ObservableMap or ObservableArray');

    this._array = [];
    this._source = source;
    this._sorter = sort || null;
    this._filter = filter || null;

    this._disposers = new Map();
    this._disposer = source.observe(this._onSourceChange);

    makeObservable(this, {
      _array: observable,
      size: computed,
      filter: action,
      sort: action,
      config: action,

    });

    if (!silent) this._build();
  }

  get size () {
    return this._array && this._array.length || 0;
  }

  filter (f) {
    if (f === this._filter) return this;
    this._filter = f || null;
    this._build();
    return this;
  }

  sort (f) {
    if (f === this._sort) return this;
    this._sort = f || null;
    this._build();
    return this;
  }

  config ({ filter, sort }) {
    if (filter === this._filter && sort === this._sort) return this;
    if (filter !== undefined) {
      this._filter = filter || null;
    }
    if (sort !== undefined)   this._sort = sort;
    this._build();
    return this;
  }

  _onSourceChange = (change) => {
    const { object, type } = change;
    if (object === this._source.records) throw new Error('Received change for something we are not observing?');

    switch (type) {
    case 'splice':
      change.removed.forEach((v) => this._delete(v));

      var values = change.added;
      if (this._sort) {
        values.forEach((v) => this._insert(v));
        return;
      }
      if (this._filter) values = values.filter(this._filter);
      this._array.push(...values);
      return;

    case 'add':
      return this._insert(change.newValue);

    case 'update':
      if (change.oldValue === change.newValue) return this._update(change.oldValue);
      this._delete(change.oldValue);
      this._insert(change.newValue);
      return;

    case 'delete':
      return this._delete(change.oldValue);

    // no default
    }
  }

  _dispose (value) {
    if (value && this._disposers.has(value)) this._disposers.get(value)();
    return this;
  }

  // _observe (value) {
  //   if (isPrimitive(value)) return; // nothing needed to observe
  //   const target = isObservable(value) ? value : observable(value);
  //   const disposer = observe(target, () => this._update(value));
  //   this._disposers.set(value, disposer);
  //   return this;
  // }

  _update (value) {
    const present = (!this._filter || this._filter(value));

    let idx, exists;

    // remove the item from the array so we can re-sort it if it needs to go back in
    while ((idx = this._array.indexOf(value)) > -1) {
      exists = true;
      this._array.splice(idx, 1); // remove it.
    }

    if (!present && exists) {
      // it's not supposed to be there anyway
      this._dispose(value);
      return this;
    }

    if (present && !exists) {
      // item was missing, start observing and sort it to the list
      // this._observe(value);
      if (this._sort) {
        idx = this._place(value);
        this._array.splice(-(idx + 1), 0, value);
      } else {
        this._array.push(value);
      }
    }

    return this;
  }

  _insert (value) {
    if (this._filter && !this._filter(value)) return;
    if (!this._sort) {
      this._array.push(value);
      return this;
    }
    const idx = this._place(value);
    if (idx < 0) {
      // this._observe(value);
      this._array.splice(-(idx + 1), 0, value); // insert into position
    }
    return this;
  }

  _delete (value) {
    let idx;
    this._dispose(value);
    while ((idx = this._array.indexOf(value)) > -1) {
      this._array.splice(idx, 1); // remove it.
    }
    return this;
  }

  _place (value) {
    return binSearch(this._array, value, this._sort);
  }

  _build () {
    const values = [];
    if (this._filter) {
      for (const v of this._source.values()) {
        if (this._filter(v)) values.push(v);
      }
    }
    if (this._sort) values.sort(this._sort);
    this._array = observable.array(values);
  }

  has     (value)   { return this._array.includes(value); }
  get     (index)   { return this._array[index]; }

  add     () { throw new Error(READ_ONLY); }
  clear   () { throw new Error(READ_ONLY); }
  delete  () { throw new Error(READ_ONLY); }

}

const ALIASABLES = [
  'entries',
  'every',
  'find',
  'flat',
  'flatMap',
  'forEach',
  'indexOf',
  'join',
  'keys',
  'lastIndexOf',
  'map',
  'filter',
  'reduce',
  'slice',
  'some',
  'toString',
  'values',
  Symbol.iterator,
];

for (const alias of ALIASABLES) {
  DerivedList.prototype[alias] = function (...args) { return this._array[alias](...args); };
}

const REJECTABLES = [
  'add',
  'clear',
  'copyWithin',
  'delete',
  'fill',
  'pop',
  'push',
  'reverse',
  'shift',
  'splice',
  'unshift',
];

for (const alias of REJECTABLES) {
  DerivedList.prototype[alias] = function () { throw new Error(READ_ONLY); };
}
