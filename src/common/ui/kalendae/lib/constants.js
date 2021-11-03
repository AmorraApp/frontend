
import * as styles from '../kalendae.scss';
export const Classes = {
  root:                  styles['kalendae'], // eslint-disable-line dot-notation
  calendarGrid:          styles['k-calendar-grid'],
  calendarGridBy1:       styles['k-calendar-grid-by-1'],
  calendarGridBy2:       styles['k-calendar-grid-by-2'],
  calendarGridBy3:       styles['k-calendar-grid-by-3'],
  calendarGridBy4:       styles['k-calendar-grid-by-4'],
  calendarGridBy6:       styles['k-calendar-grid-by-6'],
  calendar:              styles['k-calendar'],
  hasDivider:            styles['k-has-divider'],
  monthFirst:            styles['k-first-month'],
  monthMiddle:           styles['k-middle-month'],
  monthLast:             styles['k-last-month'],
  title:                 styles['k-title'],
  titleMonth:            styles['k-title-month'],
  titleYear:             styles['k-title-year'],
  dayGrid:               styles['k-day-grid'],
  active:                styles['k-active'],
  header:                styles['k-header'],
  day:                   styles['k-day'],
  dayOutMonth:           styles['k-day-out-of-month'],
  dayInMonth:            styles['k-day-in-month'],
  dayDisabled:           styles['k-day-disabled'],
  daySelected:           styles['k-day-selected'],
  dayUnselected:         styles['k-day-unselected'],
  dayBlackout:           styles['k-day-blackout'],
  dayUnselectable:       styles['k-day-unselectable'],
  dayToday:              styles['k-today'],
  dayInRange:            styles['k-range'],
  dayInRangeStart:       styles['k-range-start'],
  dayInRangeEnd:         styles['k-range-end'],
  dayRangeSelectStart:   styles['k-range-selecting'],
  dayRowIndex0:          styles['k-day-weekindex-0'],
  dayRowIndex1:          styles['k-day-weekindex-1'],
  dayRowIndex2:          styles['k-day-weekindex-2'],
  dayRowIndex3:          styles['k-day-weekindex-3'],
  dayRowIndex4:          styles['k-day-weekindex-4'],
  dayRowIndex5:          styles['k-day-weekindex-5'],
  dayRowIndex6:          styles['k-day-weekindex-6'],
  dayWeekDay0:           styles['k-day-weekday-0'],
  dayWeekDay1:           styles['k-day-weekday-1'],
  dayWeekDay2:           styles['k-day-weekday-2'],
  dayWeekDay3:           styles['k-day-weekday-3'],
  dayWeekDay4:           styles['k-day-weekday-4'],
  dayWeekDay5:           styles['k-day-weekday-5'],
  dayWeekDay6:           styles['k-day-weekday-6'],
  navLeft:               styles['k-nav-left'],
  navRight:              styles['k-nav-right'],
  previousMonth:         styles['k-btn-previous-month'],
  nextMonth:             styles['k-btn-next-month'],
  previousYear:          styles['k-btn-previous-year'],
  nextYear:              styles['k-btn-next-year'],
  disabled:              styles['k-disabled'],
};

export const MODE_SINGLE = 'SINGLE';
export const MODE_MULTIPLE = 'MULTIPLE';
export const MODE_RANGE = 'RANGE';
export const MODE_WEEK = 'WEEK';

export const DIR_PAST = 'PAST';
export const DIR_TODAY_PAST = 'TODAY_PAST';
export const DIR_ANY = 'ANY';
export const DIR_TODAY_FUTURE = 'TODAY_FUTURE';
export const DIR_FUTURE = 'FUTURE';

export const defaultFormats = {
  columnHeaderLong: 'cccc',
  columnHeaderShort:  'cccccc',
  titleMonth:    'LLLL',
  titleYear:     'yyyy',
  dayNumber:     'd',
};
