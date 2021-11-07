
import { forwardRef, useCallback, useMemo, useState } from 'react';
import useDerivedState from 'common/hooks/useDerivedState';
import useQuickKey from 'common/hooks/useKeyboard';
import { all, isDate } from 'common/utils';
import PropTypes from 'prop-types';
import { format as formatDate, parse as parseDate, isValid as dateIsValid } from 'date-fns';
import styles from './kalendae-input.scss';
import { MODE } from '../Kalendae';
import useKalendaeContext from '../lib/useKalendaeContext';
import useSelection, { valuesEqual } from '../lib/useSelection';
import useViewManager from '../lib/useViewManager';
import KalendaeBadge from './Badge';
import Enter from 'common/svgs/noun/enter.svg';
import MaskedInput from 'common/ui/masked-input';

const propTypes = {
  /**
     * The `value` attribute of underlying input
     *
     * @controllable onChange
     * */
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),

  /**
     * Input size variants
     *
     * @type {('sm'|'lg')}
     */
  size: PropTypes.string,

  /**
   * @example ['onChangePicker', [ [1, null] ]]
   */
  onChange: PropTypes.func,


  format: PropTypes.string,

  /**
   * Determines how the NumberPicker parses a number from the localized string representation.
   * You can also provide a parser `function` to pair with a custom `format`.
   */
  parse: PropTypes.func,

  name: PropTypes.string,
  placeholder: PropTypes.string,

  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  focused: PropTypes.bool,

  onIconMouseDown: PropTypes.func.isRequired,
};

const KalendaeInputFields = forwardRef(({ format, onIconMouseDown, focused, ...props }, ref) => {
  const { mode, locale } = useKalendaeContext();
  const selection = useSelection();
  const view = useViewManager();

  function parseText (v) {
    if (v === '') return null;
    const day = (isDate(v) ? v : parseDate(v, format, new Date()));
    return dateIsValid(day) && day.valueOf() > 0 ? day : false;
  }

  if (mode === MODE.MULTIPLE) {
    const children = selection.value.map((v) => v && <KalendaeBadge key={v.valueOf()} day={v} format={format} locale={locale} />);
    const [ value, setValue ] = useState('');

    const isValid = parseText(value);

    const onSave = useCallback(() => {
      if (!isValid) return;
      selection.select(isValid);
      view.bringDateIntoView(isValid);
      setValue('');
    }, [ selection, view, isValid ]);

    const onKeyDown = useQuickKey([ useQuickKey.ENTER, useQuickKey.ESCAPE ], (ev) => {
      ev.preventDefault();
      if (ev.key === useQuickKey.ESCAPE) {
        setValue('');
      } else if (ev.key === useQuickKey.ENTER) {
        onSave();
      }
    }, [ onSave ]);

    return (
      <div className={styles['multiple-container']} onMouseDown={onIconMouseDown}>
        {children}
        <span className={styles['input-wrap']}>
          <MaskedInput
            {...props}
            ref={ref}
            type="text"
            value={value}
            onChange={setValue}
            onKeyDown={onKeyDown}
          />
          {value && !isValid && <span className={styles.invalid} />}
        </span>
        {focused && value && <div className={styles.dirty} onClick={onSave} onMouseDown={onIconMouseDown}><Enter /></div>}
      </div>
    );
  }

  /** ***************************************************************************************/

  const [ value, setValue ] = useDerivedState(
    () => selection.value.map((v) => v && formatDate(v, format, { locale }) || ''),
    [ selection.value ],
  );

  const { valids, isValid, dirty } = useMemo(() => {
    const va = value.map(parseText);
    return {
      valids: va,
      isValid: !!all(va),
      dirty: !valuesEqual(va, selection.value),
    };
  }, [ value, selection ]);

  const onSave = useCallback(() => {
    if (mode === MODE.SINGLE && value[0] === '') {
      selection.deselect();
      return;
    }

    if (!isValid) return;
    selection.select(valids);
    view.bringDateIntoView(valids[0]);
  }, [ selection, view, valids ]);

  const onKeyDown = useQuickKey([ useQuickKey.ENTER, useQuickKey.ESCAPE ], (ev) => {
    ev.preventDefault();
    if (ev.key === useQuickKey.ESCAPE) {
      setValue.reset();
    } else if (ev.key === useQuickKey.ENTER) {
      onSave();
    }
  }, [ onSave ]);

  if (mode === MODE.SINGLE) {
    const onChange = useCallback((v) => setValue([ v ]), [ setValue ]);

    return (
      <>
        <span className={styles['input-wrap']}>
          <MaskedInput
            {...props}
            ref={ref}
            type="text"
            value={value[0] || ''}
            onChange={onChange}
            onKeyDown={onKeyDown}
          />
          {value[0] && !valids[0] && <span className={styles.invalid} />}
        </span>
        {focused && dirty && (value[0] || selection.value[0]) &&
          <div className={styles.dirty} onClick={onSave} onMouseDown={onIconMouseDown}><Enter /></div>
        }
      </>
    );
  }


  if (mode === MODE.RANGE) {

    const onChange = (index) => (
      (v) => {
        if (index === 0) {
          setValue([ v, value[1] ]);
        } else if (index === 1) {
          setValue([ value[0], v ]);
        }
      }
    );

    return (
      <>
        <span className={styles['input-wrap']}>
          <MaskedInput
            {...props}
            ref={ref}
            type="text"
            value={value[0] || ''}
            onChange={onChange(0)}
            onKeyDown={onKeyDown}
          />
          {!valids[0] && <span className={styles.invalid} />}
        </span>
        <span className={styles.emdash}>&mdash;</span>
        <span className={styles['input-wrap']}>
          <MaskedInput
            {...props}
            type="text"
            value={value[1] || ''}
            onChange={onChange(1)}
            onKeyDown={onKeyDown}
          />
          {!valids[1] && <span className={styles.invalid} />}
        </span>
        {focused && dirty && <div className={styles.dirty} onClick={onSave} onMouseDown={onIconMouseDown}><Enter /></div>}
      </>
    );
  }


});

KalendaeInputFields.displayName = 'KalendaeInputFields';
KalendaeInputFields.propTypes = propTypes;

export default KalendaeInputFields;

