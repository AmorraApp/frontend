import {
  isDate,
  isFunction,
  isString,
  isMappable,
  map,
} from 'common/utils';
import {
  parse as parseDate,
  parseJSON,
  isValid as dateIsValid,
  startOfDay,
  endOfDay,
  addDays,
  subDays,
} from 'date-fns';
import {
  DIR_PAST,
  DIR_TODAY_PAST,
  DIR_ANY,
  DIR_TODAY_FUTURE,
  DIR_FUTURE,
  MODE_SINGLE,
  MODE_MULTIPLE,
  MODE_RANGE,
  MODE_WEEK,
} from './constants';
import { useMemo } from 'react';
import useClock from 'common/hooks/useClock';

const noop = () => undefined;

const validDirections = {
  [DIR_PAST]:         DIR_PAST,
  [DIR_TODAY_PAST]:   DIR_TODAY_PAST,
  [DIR_ANY]:          DIR_ANY,
  [DIR_TODAY_FUTURE]: DIR_TODAY_FUTURE,
  [DIR_FUTURE]:       DIR_FUTURE,
};

const validModes = {
  [MODE_SINGLE]:   MODE_SINGLE,
  [MODE_MULTIPLE]: MODE_MULTIPLE,
  [MODE_RANGE]:    MODE_RANGE,
  [MODE_WEEK]:     MODE_WEEK,
};

export default function useKalendaeProps ({
  parse: oParse,
  blackout: oBlackout,
  dayClassName: oDayClassName,
  startDate,
  endDate,
  direction,
  months,
  mode,
  today,
  ...props
}) {

  const parse = props.parse = useMemo(() => prepareParser(oParse), [ oParse ]);

  props.blackout = useMemo(() => {
    if (isFunction(oBlackout)) return oBlackout;
    if (isMappable(oBlackout)) {
      const blackedOutDays = new Set(map(oBlackout, parse).filter(Boolean));
      return (date) => blackedOutDays.has(date);
    }
    return () => false;
  }, [ oBlackout ]);

  props.dayClassName = useMemo(() => (
    isFunction(oDayClassName) ? oDayClassName : noop
  ), [ oDayClassName ]);

  props.months    = months    = months > 0 ? Math.floor(months) : 1;
  props.direction = direction = validDirections[direction && String(direction).toUpperCase()] || DIR_ANY;
  props.mode                  = validModes[mode && String(mode).toUpperCase()] || MODE_SINGLE;


  // first try to parse `today`, fallback to the day clock if that isn't parsable
  today = useMemo(() => today && parse(today), [ today ]) || useClock(useClock.DAYS);

  // now move that to startOfDay, memoized so we don't produce a new date every render
  props.today = today = useMemo(() => startOfDay(today), [ today ]); // now turn

  props.startDate = startDate = useMemo(() => {
    if (startDate) {
      startDate = startOfDay(parse(startDate)) || null;
    }
    if (!startDate) {
      if (direction === DIR_PAST) {
        startDate = startOfDay(subDays(today, 1));
      } else if (direction === DIR_TODAY_PAST) {
        startDate = startOfDay(today);
      }
    }
    return startDate;
  }, [ today, startDate, direction ]);

  props.endDate = endDate = useMemo(() => {
    if (endDate) {
      endDate = endOfDay(parse(endDate)) || null;
    }
    if (!endDate) {
      if (direction === DIR_FUTURE) {
        endDate = startOfDay(addDays(today, 1));
      } else if (direction === DIR_TODAY_FUTURE) {
        endDate = startOfDay(today);
      }
    }
    return endDate;
  }, [ today, endDate, direction ]);

  return props;
}

export function prepareParser (oParse) {
  let predicate = parseJSON;

  if (isFunction(oParse)) {
    predicate = (v) => (isDate(v) ? v : oParse(v));
  }

  if (isString(oParse)) {
    predicate = (v) => (isDate(v) ? v : parseDate(v, oParse, new Date()));
  }

  return (v) => {
    var res = predicate(v);
    return dateIsValid(res) ? res : null;
  };
}
