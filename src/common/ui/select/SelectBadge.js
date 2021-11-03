
import { useCallback } from 'react';
import Badge from 'common/ui/badge';
import * as styles from './select.scss';
import useSelectContext, { valuePropType } from './useSelectContext';

export default function SelectBadge ({ option }) {

  const { selection, disabled } = useSelectContext();

  const onClose = useCallback((ev) => {
    ev.preventDefault();
    selection.deselect(option);
  }, [ selection ]);

  return (
    <Badge
      onClose={onClose}
      className={styles.badge}
      title={option.label}
      disabled={disabled}
    >{option.caption ?? option.value}</Badge>
  );
}

SelectBadge.propTypes = {
  option: valuePropType,
};
