
import PropTypes from 'prop-types';
import { useCallback } from 'react';
import Badge from 'common/ui/badge';
import useViewManager from '../lib/useViewManager';
import useSelection from '../lib/useSelection';
import styles from './kalendae-input.scss';
import { format as formatDate } from 'date-fns';

export default function KalendaeBadge ({ day, format, locale }) {
  const selection = useSelection();
  const viewState = useViewManager();

  const onClose = useCallback((ev) => {
    ev.preventDefault();
    selection.deselect(day);
  }, [ selection ]);

  const onClick = useCallback((ev) => {
    ev.preventDefault();
    viewState.bringDateIntoView(day);
  }, [ selection ]);

  return (
    <Badge onClose={onClose} onClick={onClick} className={styles.badge}>{formatDate(day, format, { locale }) || ''}</Badge>
  );
}

KalendaeBadge.propTypes = {
  day: PropTypes.instanceOf(Date),
  format: PropTypes.string,
  locale: PropTypes.object,
};
