/* eslint key-spacing: 0 */

import useKalendaeContext from './lib/useKalendaeContext';
import useViewManager from './lib/useViewManager';
import { useCallback } from 'react';
import { add } from 'date-fns';
import { cl as classNames } from 'common/utils';

const KalendaeNav = () => {
  const { classes, hideNav } = useKalendaeContext();
  const view = useViewManager();
  const { viewStartDate, cappedStart, cappedEnd } = view;

  const showMonths = hideNav !== true && hideNav !== 'month';
  const showYears = hideNav !== true && hideNav !== 'year';

  const incrementYear  = useCallback(() => { view.setStartDate(add(viewStartDate, { years:   1 } )); });
  const incrementMonth = useCallback(() => { view.setStartDate(add(viewStartDate, { months:  1 } )); });
  const decrementMonth = useCallback(() => { view.setStartDate(add(viewStartDate, { months: -1 } )); });
  const decrementYear  = useCallback(() => { view.setStartDate(add(viewStartDate, { years:  -1 } )); });

  return (
    <>
      <div className={classes.navLeft}>
        {showYears  && <a className={classNames(classes.previousYear,  cappedStart && classes.disabled )}  onClick={decrementYear} />}
        {showMonths && <a className={classNames(classes.previousMonth, cappedStart && classes.disabled )} onClick={decrementMonth}  />}
      </div>
      <div className={classes.navRight}>
        {showMonths && <a className={classNames(classes.nextMonth, cappedEnd && classes.disabled )}  onClick={incrementMonth} />}
        {showYears  && <a className={classNames(classes.nextYear,  cappedEnd && classes.disabled )}   onClick={incrementYear} />}
      </div>
    </>
  );
};

KalendaeNav.displayName = 'KalendaeNav';
export default KalendaeNav;
