import {
  cl as classNames,
  isString,
  marshal,
} from 'common/utils';
import PropTypes from 'prop-types';
import { prepareKalendaeContext, KalendaeContextProvider } from './lib/useKalendaeContext';
import { SelectionProvider } from './lib/useSelection';
import { ViewProvider } from './lib/useViewManager';
import KalendaeCalendars from './Calendars';
import KalendaeNav from './Nav';

import {
  MODE_SINGLE,
  MODE_MULTIPLE,
  MODE_RANGE,
  MODE_WEEK,
  DIR_PAST,
  DIR_TODAY_PAST,
  DIR_ANY,
  DIR_TODAY_FUTURE,
  DIR_FUTURE,
  Classes,
  defaultFormats,
} from './lib/constants';

export const MODE = {
  SINGLE:   MODE_SINGLE,
  MULTIPLE: MODE_MULTIPLE,
  RANGE:    MODE_RANGE,
  WEEK:     MODE_WEEK,
};

export const DIRECTION = {
  PAST:         DIR_PAST,
  TODAY_PAST:   DIR_TODAY_PAST,
  ANY:          DIR_ANY,
  TODAY_FUTURE: DIR_TODAY_FUTURE,
  FUTURE:       DIR_FUTURE,
};

function isEnum (...values) {
  values = values.flat(Infinity).map((e) => (isString(e) ? e.toUpperCase() : e));
  return (props, propName, componentName, location, propFullName) => {
    let v = props[propName];
    v = isString(v)
      ? props[propName].toUpperCase()
      : props[propName]
    ;
    if (v && !values.includes(v)) {
      return new Error(`Invalid ${location} \`${propFullName}\` of value \`${String(v)}\` supplied to \`${componentName}\`, expected one of ${JSON.stringify(values)}.`);
    }
  };
}

const propTypes = {
  mode: isEnum([ MODE_SINGLE, MODE_MULTIPLE, MODE_RANGE, MODE_WEEK ]),
  months: PropTypes.number,
  columns: PropTypes.oneOf([ 'auto', 1, 2, 3, 4, 6 ]),
  weekStart: PropTypes.oneOf([ 0, 1, 2, 3, 4, 5, 6 ]),
  direction: isEnum([
    DIR_PAST,
    DIR_TODAY_PAST,
    DIR_ANY,
    DIR_TODAY_FUTURE,
    DIR_FUTURE,
  ]),
  directionScrolling: isEnum([
    DIR_PAST,
    DIR_TODAY_PAST,
    DIR_ANY,
    DIR_TODAY_FUTURE,
    DIR_FUTURE,
  ]),
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date),
    PropTypes.arrayOf(PropTypes.instanceOf(Date)),
  ]),
  onChange: PropTypes.func,
  blackout: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.arrayOf(PropTypes.instanceOf(Date)),
  ]),
  viewStartDate: PropTypes.instanceOf(Date),
  startDate: PropTypes.instanceOf(Date),
  endDate: PropTypes.instanceOf(Date),
  today: PropTypes.instanceOf(Date),
  parse: PropTypes.oneOfType([ PropTypes.func, PropTypes.string ]),
  formats: PropTypes.shape({
    columnHeaderLong:  PropTypes.string,
    columnHeaderShort: PropTypes.string,
    titleMonth:        PropTypes.string,
    titleYear:         PropTypes.string,
    dayNumber:         PropTypes.string,
  }).isRequired,
  classes: PropTypes.object,
  dayClassName: PropTypes.func,
  dayOutOfMonthClickable: PropTypes.bool,
  dayHeaderClickable: PropTypes.bool,
  hideNav: PropTypes.oneOf([ false, true, 'year', 'month' ]),
  locale: PropTypes.shape({ // date-fns locale object
    code: PropTypes.string,
    localize: PropTypes.shape({
      ordinalNumber: PropTypes.func,
      era:           PropTypes.func,
      quarter:       PropTypes.func,
      month:         PropTypes.func,
      day:           PropTypes.func,
      dayPeriod:     PropTypes.func,
    }),
    formatLong: PropTypes.shape({
      date:     PropTypes.func,
      time:     PropTypes.func,
      dateTime: PropTypes.func,
    }),
    match: PropTypes.shape({
      ordinalNumber: PropTypes.func,
      era:           PropTypes.func,
      quarter:       PropTypes.func,
      month:         PropTypes.func,
      day:           PropTypes.func,
      dayPeriod:     PropTypes.func,
    }),
    options: PropTypes.shape({
      weekStartsOn: PropTypes.oneOf([ 0, 1, 2, 3, 4, 5, 6 ]),
      firstWeekContainsDate: PropTypes.oneOf([ 1, 2, 3, 4, 5, 6, 7 ]),
    }),
  }),
};

const defaultProps = {
  mode: MODE_SINGLE,
  months: 1,
  columns: 'auto',
  weekStart: 0,
  direction: DIR_ANY,
  directionScrolling: false,
  blackout: null,
  classes: Classes,
  dayClassName: null,
  formats: defaultFormats,
  today: new Date,
};

const eventNames = [
  'onClick',
  'onContextMenu',
  'onDoubleClick',
  'onDrag',
  'onDragEnd',
  'onDragEnter',
  'onDragExit',
  'onDragLeave',
  'onDragOver',
  'onDragStart',
  'onDrop',
  'onMouseDown',
  'onMouseEnter',
  'onMouseLeave',
  'onMouseMove',
  'onMouseOut',
  'onMouseOver',
  'onMouseUp',
  'onTouchCancel',
  'onTouchEnd',
  'onTouchMove',
  'onTouchStart',
];

const Kalendae = ({ className, ...rawProps }) => {

  const [ eventProps, uncontrolledProps ] = marshal(rawProps, eventNames);
  const context = prepareKalendaeContext(uncontrolledProps);
  const { classes } = context;

  return (
    <KalendaeContextProvider context={context}>
      <SelectionProvider context={context}>
        <ViewProvider context={context}>
          <div className={classNames(className, classes.root )} {...eventProps}>
            <KalendaeCalendars />
            <KalendaeNav />
          </div>
        </ViewProvider>
      </SelectionProvider>
    </KalendaeContextProvider>
  );
};

Kalendae.propTypes = propTypes;
Kalendae.defaultProps = defaultProps;
Kalendae.displayName = 'Kalendae';

Kalendae.MODE = MODE;
Kalendae.DIRECTION = DIRECTION;

export default Kalendae;
