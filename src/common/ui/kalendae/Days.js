import PropTypes from 'prop-types';
import useKalendaeContext from './lib/useKalendaeContext';
import { useMemo, useCallback } from 'react';
import useSelection from './lib/useSelection';
import {
  format as formatDate,
  setDay as setDayOfWeek,
  getDay as getDayOfWeek,
  startOfMonth,
  addDays,
  isSameMonth,
  isSameDay,
  isAfter,
  isBefore,
} from 'date-fns';
import KalendaeDay from './Day';
import { range } from 'common/utils';

const propTypes = {
  month: PropTypes.instanceOf(Date),
};

const KalendaeDays = ({ month }) => {
  const { classes, weekStart, formats, locale, startDate, endDate, today, blackout, dayClassName } = useKalendaeContext();
  const selection = useSelection();

  const onClick = useCallback((day) => selection.dayClicked(day), [ selection ]);

  const days = useMemo(() => {
    const startDay = startOfMonth(month);
    const firstDay = getDayOfWeek(startDay) < weekStart
      ? setDayOfWeek(startDay, weekStart - 7)
      : setDayOfWeek(startDay, weekStart)
    ;

    return range(0, 41, (i) => {
      const day = addDays(firstDay, i);

      const isUnselectable = (endDate && isAfter(endDate, day)) || (startDate && isBefore(startDate, day));
      const isToday = isSameDay(today, day);
      const isInMonth = isSameMonth(day, month);
      const isBlackedOut = blackout(day);
      const isDisabled = (isBlackedOut || isUnselectable);
      const className = dayClassName(day);

      const dayProps = {
        month,
        day,
        key: day.toJSON(),
        label: formatDate(day, formats.dayNumber, { locale }),
        weekIndex: i % 7,
        dayOfWeekIndex: getDayOfWeek(day),
        isToday,
        isInMonth,
        isBlackedOut,
        isUnselectable,
        isDisabled,
        className,
      };

      return dayProps;
    });
  }, [ month, weekStart, formats.dayNumber, today, startDate, endDate ]);

  return days.map((dayProps) => (
    <KalendaeDay
      {...dayProps}
      isSelected={selection.contains(dayProps.day)}
      onClick={onClick}
      classes={classes}
    />
  ));
};

KalendaeDays.displayName = 'KalendaeDays';
KalendaeDays.propTypes = propTypes;
export default KalendaeDays;
