
import PropTypes from 'prop-types';
import { forwardRef, useCallback } from 'react';
import styles from './select.scss';
import useSelectContext from './useSelectContext';

const propTypes = {

  multiple: PropTypes.bool,
  placeholder: PropTypes.string,
  selectProps: PropTypes.object,
  id: PropTypes.string,
};

const SelectNative = forwardRef(({
  placeholder,
  selectProps,
}, ref) => {

  const { selection, options, id, multiple } = useSelectContext();
  const { flatValues } = selection;

  const handleSelectElementChange = useCallback((ev) => {
    selection.changed(ev.target.value);
  }, [ selection ]);

  return (
    <select
      {...selectProps}
      id={id}
      ref={ref}
      value={multiple ? flatValues : flatValues[0]}
      multiple={multiple}
      placeholder={placeholder}
      className={styles['select-native']}
      onChange={handleSelectElementChange}
      tabIndex={-1}
    >{renderOptions(options)}</select>
  );

});
SelectNative.displayName = 'SelectNative';
SelectNative.propTypes = propTypes;
export default SelectNative;


function renderOptions (options = []) {
  return options.map(({ group, label, value, caption, options: goptions }, i) => (
    group
      ? <optgroup key={i} label={label}>{renderOptions(goptions)}</optgroup>
      : <option key={value} value={value}>{caption}</option>
  ));
}
