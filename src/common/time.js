import locale from 'date-fns/locale/en-US/index.js';
import { parseJSON as parseJsonDate, isValid as dateIsValid } from 'date-fns';

var MINUTES_IN_DAY = 1440;
var MINUTES_IN_MONTH = 43200;
var MINUTES_IN_YEAR = 525600;

export function humanTime (seconds) {
  var minutes = Math.floor(seconds / 60);

  var unit;
  if (minutes < 1) {
    unit = 'second';
  } else if (minutes < 60) {
    unit = 'minute';
  } else if (minutes < MINUTES_IN_DAY) {
    unit = 'hour';
  } else if (minutes < MINUTES_IN_MONTH) {
    unit = 'day';
  } else if (minutes < MINUTES_IN_YEAR) {
    unit = 'month';
  } else {
    unit = 'year';
  }

  // 0 up to 60 seconds
  if (unit === 'second') {
    return locale.formatDistance('xSeconds', seconds);

    // 1 up to 60 mins
  } else if (unit === 'minute') {
    return locale.formatDistance('xMinutes', minutes);

    // 1 up to 24 hours
  } else if (unit === 'hour') {
    var hours = Math.floor(minutes / 60);
    return locale.formatDistance('xHours', hours);

    // 1 up to 30 days
  } else if (unit === 'day') {
    var days = Math.floor(minutes / MINUTES_IN_DAY);
    return locale.formatDistance('xDays', days);

    // 1 up to 12 months
  } else if (unit === 'month') {
    var months = Math.floor(minutes / MINUTES_IN_MONTH);
    return locale.formatDistance('xMonths', months);

    // 1 year up to max Date
  } else if (unit === 'year') {
    var years = Math.floor(minutes / MINUTES_IN_YEAR);
    return locale.formatDistance('xYears', years);
  }
}

export function isValidDate (d) {
  d = parseJsonDate(d);
  return dateIsValid(d) ? d : null;
}
