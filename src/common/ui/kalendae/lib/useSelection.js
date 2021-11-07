
import PropTypes from 'prop-types';
import { useMemo, createContext, useContext, useRef } from 'react';
import useDerivedState from 'common/hooks/useDerivedState';

import {
  isArray,
  all,
} from 'common/utils';
import {
  MODE_SINGLE,
  MODE_MULTIPLE,
  MODE_RANGE,
  MODE_WEEK,
} from './constants';
import {
  startOfWeek,
  endOfWeek,
  lastDayOfWeek,
  isSameDay,
  isAfter,
  isBefore,
  addDays,
} from 'date-fns';
import DateSet from './date-set';

export const SelectionContext = createContext();
SelectionContext.displayName = 'SelectionContext';

export const SelectionProvider = ({ context, children }) => {
  if (useContext(SelectionContext)) return children;

  const { mode, parse, onChange, today, locale, weekStartsOn, value: _value } = context;

  // SelectionManager is initialized into a ref that will persist continually.
  // The current context is then written into that object every time the provider
  // is re-rendered due to a context or selection change.

  const { current: sm } = useRef(new SelectionManager);
  sm._value =       _value;
  sm.mode =         mode;
  sm.parse =        parse;
  sm.onChange =     onChange;
  sm.today =        today;
  sm.locale =       locale;
  sm.weekStartsOn = weekStartsOn;

  const [ selectionState, setSelectionState ] = useDerivedState(
    () => sm.derive(),
    [ _value, parse, mode, locale, weekStartsOn ],
    ({ value: a }, { value: b }) => !valuesEqual(a, b),
  );

  const { value, multimap, rangeStart } = selectionState;
  sm.value =      value;
  sm.multimap =   multimap;
  sm.rangeStart = rangeStart;
  sm.setSelectionState = setSelectionState;

  // We then wrap the SelectionManager with a prototype descendant, memoized on the view state,
  // so that the context provider treats it as a new object whenever the state changes.

  const selectionContext = useMemo(
    () => (Object.create(sm)),
    Object.values(selectionState),
  );

  return (
    <SelectionContext.Provider value={selectionContext}>
      {children}
    </SelectionContext.Provider>
  );
};

SelectionProvider.propTypes = {
  context: PropTypes.object.isRequired,
};

export default function useSelection () {
  return useContext(SelectionContext);
}

export const SELECTION_INPROGRESS  = useSelection.INPROGRESS  = 'INPROGRESS';
export const SELECTION_START       = useSelection.START       = 'START';
export const SELECTION_END         = useSelection.END         = 'END';
export const SELECTION_MIDDLE      = useSelection.MIDDLE      = 'MIDDLE';

class SelectionManager {

  derive () {
    const { parse, mode, locale, weekStartsOn } = this;
    let { _value: value } = this;

    if (!value) {
      return { value: [], multimap: new DateSet(), rangeStart: null };
    }

    let multimap;
    if (!isArray(value)) value = [ value ];

    value = value.map(parse).sort(dateSort);

    if (mode === MODE_SINGLE) {
      value = [ value[0] ];
      multimap = new DateSet(value);

    } else if (mode === MODE_RANGE) {
      value = [ value[0], value[value.length - 1] ];
      multimap = new DateSet(value);

    } else if (mode === MODE_WEEK) {
      value = [
        startOfWeek(value[0], { locale, weekStartsOn }),
        lastDayOfWeek(value[0], { locale, weekStartsOn }),
      ];
      multimap = new DateSet(value);

    } else if (mode === MODE_MULTIPLE) {
      multimap = new DateSet(value);
      value = Array.from(multimap.values());
    }

    return { value, multimap, rangeStart: null };
  }

  contains (date) {
    const { mode, value } = this;

    if (mode === MODE_RANGE && this.rangeStart && isSameDay(date, this.rangeStart)) return SELECTION_INPROGRESS;

    if (value.length === 1 || mode === MODE_SINGLE) {
      return isSameDay(date, value[0]);

    } else if (mode === MODE_RANGE || mode === MODE_WEEK) {
      if (isSameDay(date, value[0])) return SELECTION_START;
      if (isSameDay(date, value[1])) return SELECTION_END;
      if (isAfter(date, value[0]) && isBefore(date, value[1])) return SELECTION_MIDDLE;
      return false;

    } else if (mode === MODE_MULTIPLE) {
      const target = this.has(date);
      if (!target) return false;

      const prev = this.has(addDays(date, -1));
      const post = this.has(addDays(date, 1));

      if (post && !prev) return SELECTION_START;
      if (prev && !post) return SELECTION_END;
      if (prev && post) return SELECTION_MIDDLE;
      return true;
    }
  }

  first () {
    return this.value[0] || null;
  }

  last () {
    return this.value[this.value - 1] || null;
  }

  select (...value) {
    value = value.flat(Infinity);

    if (!value.length) {
      if (!valuesEqual(value, this.value)) {
        this.updateState({ value, multimap: new DateSet() });
        if (this.onChange) this.onChange(value);
      }
      return;
    }

    if (this.mode === MODE_RANGE) {
      value = [ value[0], value[value.length - 1] ];
      if (!valuesEqual(value, this.value)) {
        this.updateState({ value, multimap: new DateSet(value), rangeStart: null });
        if (this.onChange) this.onChange(value);
      }
      return;
    }


    if (this.mode === MODE_SINGLE) {
      value = [ value[0] ];
      if (!valuesEqual(value, this.value)) {
        this.updateState({ value, multimap: new DateSet(value) });
        if (this.onChange) this.onChange(value);
      }
      return;
    }


    if (this.mode === MODE_MULTIPLE) {
      let toggle = null;
      if (value.length > 1) {
        toggle = all(value.map((d) => this.multimap.has(d)));
      }

      for (const day of value) {
        const has = this.multimap.has(day);
        if (has && toggle !== true) this.multimap.delete(day);
        if (!has && toggle !== false) this.multimap.add(day);
      }

      value = Array.from(this.multimap.values()).sort(dateSort);
      if (!valuesEqual(value, this.value)) {
        this.updateState({ value, multimap: this.multimap });
        if (this.onChange) this.onChange(value);
      }
      return;
    }


    if (this.mode === MODE_WEEK) {
      const { weekStartsOn } = this;
      value = [ startOfWeek(value[0], { weekStartsOn }), endOfWeek(value[0], { weekStartsOn }) ];
      if (!valuesEqual(value, this.value)) {
        this.updateState({ value, multimap: new DateSet(value) });
        if (this.onChange) this.onChange(value);
      }
      return;
    }
  }

  deselect (day) {
    if (this.mode === MODE_MULTIPLE) {
      if (!this.multimap.has(day)) return;
      this.multimap.delete(day);

      const value = Array.from(this.multimap.values());
      this.updateState({ value, multimap: this.multimap });
      if (this.onChange) this.onChange(value);
      return;
    }

    if (this.value.length) {
      this.updateState({ value: [], multimap: new DateSet() });
      if (this.onChange) this.onChange([]);
    }
  }

  dayClicked (day) {
    const { mode, rangeStart } = this;

    if (mode === MODE_RANGE) {
      if (rangeStart) {
        if (isAfter(rangeStart, day)) {
          this.select(day, rangeStart);
        } else {
          this.select(rangeStart, day);
        }
      } else {
        this.updateState({ rangeStart: day });
      }
    } else {
      this.select(day);
    }
  }

  dayChanged (input, index) {
    const { mode, parse } = this;
    const day = parse(input);
    if (!day) return; // input field doesn't have a valid date

    if (mode === MODE_SINGLE) {
      this.select(day);
    } else if (mode === MODE_RANGE && (index === 0 || index === 1)) {
      const v = this.value;
      v[index] = day;
      this.select(v);
    }
  }

  has (day) {
    return this.multimap.has(day);
  }

  updateState (input) {
    Object.assign(this, input);
    const { value, multimap, rangeStart } = this;
    this.setSelectionState({ value, multimap, rangeStart });
  }
}


export function valuesEqual (a, b) {
  if (!isArray(a) || !isArray(b)) throw new Error('Received non-value');
  if (a.length !== b.length) return false;
  if (!a.length) return true;
  for (let i = a.length; i--;) {
    if (!isSameDay(a[i], b[i])) return false;
  }
  return true;
}

function dateSort (a, b) { return a.valueOf() - b.valueOf(); }
