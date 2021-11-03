import { cl as classNames } from 'common/utils';
import PropTypes from 'prop-types';
import { useCallback } from 'react';
import {
  SELECTION_INPROGRESS,
  SELECTION_START,
  SELECTION_END,
  SELECTION_MIDDLE,
} from './lib/useSelection';

const propTypes = {
  day: PropTypes.instanceOf(Date),
  label: PropTypes.string,
  weekIndex: PropTypes.number,
  dayOfWeekIndex: PropTypes.number,
  isSelected: PropTypes.oneOf([ false, true, SELECTION_INPROGRESS, SELECTION_START, SELECTION_END, SELECTION_MIDDLE ]),
  isBlackedOut: PropTypes.bool,
  isToday: PropTypes.bool,
  isInMonth: PropTypes.bool,
  isUnselectable: PropTypes.bool,
  isDisabled: PropTypes.bool,
  classes: PropTypes.object,
  onClick: PropTypes.func,
};

const KalendaeDays = ({
  day,
  label,
  weekIndex,
  dayOfWeekIndex,
  isSelected,
  isToday,
  isInMonth,
  isBlackedOut,
  isUnselectable,
  isDisabled,
  className,
  classes: styles,
  onClick,
}) => {
  const handleClick = isDisabled && onClick ? undefined : useCallback(() => { onClick(day); }, [ onClick ]);

  const classes = [
    className,
    styles.day,
    styles[`dayRowIndex${weekIndex}`],
    styles[`dayWeekDay${dayOfWeekIndex}`],
    isInMonth ? styles.dayInMonth : styles.dayOutMonth,
    isToday && styles.dayToday,
    isBlackedOut && styles.dayBlackout,
    isUnselectable && styles.dayUnselectable,
    isDisabled ? styles.dayDisabled : styles.active,
    isSelected ? styles.daySelected : styles.dayUnselected,
    (isSelected === SELECTION_MIDDLE) && styles.dayInRange,
    (isSelected === SELECTION_START) && styles.dayInRangeStart,
    (isSelected === SELECTION_END) && styles.dayInRangeEnd,
    (isSelected === SELECTION_INPROGRESS) && styles.dayRangeSelectStart,
  ];

  return (
    <span className={classNames(classes)} onClick={handleClick}>
      <span>{label}</span>
      {isToday && <em />}
    </span>
  );
};

KalendaeDays.displayName = 'KalendaeDays';
KalendaeDays.propTypes = propTypes;
export default KalendaeDays;
