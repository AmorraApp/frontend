import PropTypes from 'prop-types';
import { useMemo, useCallback } from 'react';
import {
  format as formatDate,
  setDay as setDayOfWeek,
  getDay as getDayOfWeek,
  addDays,
  startOfMonth,
  isSameMonth,
  addWeeks,
} from 'date-fns';
import { range } from 'common/utils';
import { MODE_MULTIPLE } from './lib/constants';
import useKalendaeContext from './lib/useKalendaeContext';
import useSelection from './lib/useSelection';

const propTypes = {
  month: PropTypes.instanceOf(Date),
};

const KalendaeHeader = () => {
  const { dayHeaderClickable, mode, month, weekStart, formats, classes, locale, today } = useKalendaeContext();
  const selection = useSelection();

  const handleHeaderClick = useCallback((weekDay) => {
    if (!dayHeaderClickable || mode !== MODE_MULTIPLE) return;

    const startDay = startOfMonth(month);
    const firstDay = getDayOfWeek(startDay) > weekDay
      ? setDayOfWeek(startDay, weekDay + 7)
      : setDayOfWeek(startDay, weekDay)
    ;

    for (let i = 0; i < 6; i++) {
      const day = addWeeks(firstDay, i);
      if (!isSameMonth(firstDay, day)) break;
      selection.dayClicked(day);
    }
  }, [ dayHeaderClickable, mode, month, selection ]);

  const headers = useMemo(() => {
    const startDay = setDayOfWeek(today, weekStart);
    return range(0, 6, (i) => {
      const day = addDays(startDay, i);
      return [
        getDayOfWeek(day),
        formatDate(day, formats.columnHeaderShort, { locale }),
        formatDate(day, formats.columnHeaderShort, { locale }),
      ];
    });
  }, [ weekStart, formats.columnHeader ]);

  return headers.map(([ weekDay, captionLong, captionShort ]) => (
    <span
      key={weekDay}
      className={classes.header}
      onClick={() => handleHeaderClick(weekDay)}
      role="columnheader"
    ><abbr title={captionLong}>{captionShort}</abbr></span>
  ));
};

KalendaeHeader.displayName = 'KalendaeHeader';
KalendaeHeader.propTypes = propTypes;
export default KalendaeHeader;
