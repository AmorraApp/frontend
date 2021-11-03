
import { addMonths } from 'date-fns';
import {
  cl as classNames,
  range,
} from 'common/utils';
import useViewManager from './lib/useViewManager';
import useKalendaeContext from './lib/useKalendaeContext';
import KalendaeCalendar from './Calendar';

const KalendaeCalendars = () => {
  const { classes, months, columns } = useKalendaeContext();
  const { viewStartDate } = useViewManager();

  let columnCount = months;

  if (columns === 'auto') {
    if (months > 8 && !(months % 4)) {
      columnCount = 4;
    } else if (!(months % 3)) {
      columnCount = 3;
    } else if (!(months % 2)) {
      columnCount = 2;
    }
  } else if (!classes['calendarGridBy' + columnCount]) {
    columnCount = 2;
  }

  const by = classes['calendarGridBy' + columnCount];

  return (
    <div className={classNames(classes.calendarGrid, by)} data-months={months}>
      {range(0, months - 1, (index) => (
        <KalendaeCalendar
          key={index}
          month={addMonths(viewStartDate, index)}
          className={classNames(!!(index % columnCount) && classes.hasDivider)}
        />
      ))}
    </div>
  );
};

KalendaeCalendars.displayName = 'KalendaeCalendars';
export default KalendaeCalendars;
