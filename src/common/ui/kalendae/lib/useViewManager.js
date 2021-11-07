
import PropTypes from 'prop-types';
import { useMemo, createContext, useContext, useRef } from 'react';
import useDerivedState from 'common/hooks/useDerivedState';

import useSelection from './useSelection';
import { clamp } from 'common/utils';

import {
  isValid as dateIsValid,
  isSameMonth,
  subMonths,
  startOfMonth,
  endOfMonth,
  addMonths,
  isBefore,
  isAfter,
} from 'date-fns';

import {
  DIR_PAST,
  DIR_TODAY_PAST,
  DIR_ANY,
  DIR_TODAY_FUTURE,
  DIR_FUTURE,
} from './constants';

export const ViewContext = createContext();
ViewContext.displayName = 'ViewContext';

class ViewManager {

  derive () {
    const { parse, _viewStartDate, today, months, direction, startDate, endDate } = this;

    let viewStartDate = parse(_viewStartDate);
    if (!dateIsValid(viewStartDate)) {
      viewStartDate = this.selection.first() || new Date(today);
    }

    // decide if we need to shift view delta based on direction.
    const viewDelta = ({
      [DIR_PAST]:          months - 1,
      [DIR_TODAY_PAST]:    months - 1,
      [DIR_ANY]:           months > 2 ? Math.floor(months / 2) : 0,
      [DIR_TODAY_FUTURE]:  0,
      [DIR_FUTURE]:        0,
    })[direction];

    if (viewDelta && isSameMonth(viewStartDate, today)) {
      viewStartDate = subMonths(viewStartDate, viewDelta);
    }

    viewStartDate = startOfMonth(viewStartDate);
    const viewEndDate = endOfMonth(months > 1 ? addMonths(viewStartDate, months - 1) : viewStartDate);

    const [ cappedStart, cappedEnd ] = caps(startDate, endDate, viewStartDate, viewEndDate);

    return {
      viewStartDate,
      viewEndDate,
      cappedStart,
      cappedEnd,
    };
  }

  setStartDate (month) {
    const { months, onViewChange, startDate, endDate, setViewState } = this;
    month = startOfMonth(month);

    const minStartDate = endDate   && (months > 1 ? subMonths(endDate, months - 1) : endDate) || null;
    const maxStartDate = startDate || null;

    const viewStartDate = clamp(month, minStartDate, maxStartDate);
    const viewEndDate = endOfMonth(months > 1 ? addMonths(viewStartDate, months - 1) : viewStartDate);

    const [ cappedStart, cappedEnd ] = caps(startDate, endDate, viewStartDate, viewEndDate);

    const newState = {
      viewStartDate,
      viewEndDate,
      cappedStart,
      cappedEnd,
    };

    setViewState(newState);

    if (onViewChange) onViewChange(viewStartDate, viewEndDate);

    return newState;
  }

  bringDateIntoView (day) {
    const { viewStartDate, viewEndDate, months } = this;

    if (day < viewStartDate) return this.setStartDate(day);
    if (day > viewEndDate) return this.setStartDate(months > 1 ? subMonths(day, months - 1) : day);
  }

  updateForSelectionIfNeeded () {
    if (!this.selection.value.length) return;

    const { viewStartDate, viewEndDate, selection } = this;
    for (let day = viewStartDate; day < viewEndDate; day = addMonths(day, 1)) {
      if (selection.contains(day)) return;
    }

    this.bringDateIntoView(this.selection.value[0]);
  }
}


export const ViewProvider = ({ context, children }) => {
  if (useContext(ViewContext)) return children;

  const { parse, viewStartDate: _viewStartDate, today, months, direction, onViewChange, startDate, endDate } = context;
  const selection = useSelection();

  // ViewManager is initialized into a ref that will persist continually.
  // The current context is then written into that object every time the provider
  // is re-rendered due to a context or selection change.

  const { current: vm } = useRef(new ViewManager);
  vm._viewStartDate = _viewStartDate;
  vm.parse =          parse;
  vm.today =          today;
  vm.months =         months;
  vm.direction =      direction;
  vm.onViewChange =   onViewChange;
  vm.startDate =      startDate;
  vm.endDate =        endDate;
  vm.selection =      selection;

  // The actual view state is then initialized as a derived state based on the props
  // received via the kalendae context. This state is then mixed into the ViewManager
  // at every re-render, along with the state setter function.

  const [ viewState, setViewState ] = useDerivedState(
    () => vm.derive(),
    [ vm, _viewStartDate, months, direction, parse, today ],
  );

  vm.setViewState =  setViewState;
  vm.viewStartDate = viewState.viewStartDate;
  vm.viewEndDate =   viewState.viewEndDate;
  vm.cappedStart =   viewState.cappedStart;
  vm.cappedEnd =     viewState.cappedEnd;

  // We then wrap the ViewManager with a prototype descendant, memoized on the view state,
  // so that the context provider treats it as a new object whenever the state changes.

  const viewContext = useMemo(
    () => (Object.create(vm)),
    Object.values(viewState),
  );

  return (
    <ViewContext.Provider value={viewContext}>{children}</ViewContext.Provider>
  );
};

ViewProvider.propTypes = {
  context: PropTypes.object.isRequired,
};

export default function useViewManager () {
  return useContext(ViewContext) || {};
}



function caps (startDate, endDate, viewStartDate, viewEndDate) {
  const cappedStart =   endDate ? (isSameMonth(  endDate, viewEndDate)   || isBefore( viewEndDate, endDate))   : false;
  const cappedEnd   = startDate ? (isSameMonth(startDate, viewStartDate) || isAfter(viewStartDate, startDate)) : false;
  return [ cappedStart, cappedEnd ];
}
