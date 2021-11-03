
import PropTypes from 'prop-types';
import { format as formatDate } from 'date-fns';
import { cl as classNames } from 'common/utils';
import useKalendaeContext from './lib/useKalendaeContext';
import KalendaeHeader from './Header';
import KalendaeDays from './Days';


const propTypes = {
  month: PropTypes.instanceOf(Date),
};

const KalendaeCalendar = ({ month, className }) => {
  const { classes, formats, locale } = useKalendaeContext();

  return (
    <div className={classNames(classes.calendar, className)}>
      <div className={classes.title}>
        <span className={classes.titleMonth}>{formatDate(month, formats.titleMonth, { locale })}</span>
        <span className={classes.titleYear}>{formatDate(month, formats.titleYear, { locale })}</span>
      </div>
      <div className={classes.dayGrid}>
        <KalendaeHeader />
        <KalendaeDays month={month} />
      </div>
    </div>
  );
};

KalendaeCalendar.displayName = 'KalendaeCalendar';
KalendaeCalendar.propTypes = propTypes;
export default KalendaeCalendar;
