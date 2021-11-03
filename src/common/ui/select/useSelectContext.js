
import PropTypes from 'common/prop-types';
import { useDerivedSet, useComputedRef } from 'common/hooks';
import quickContext from 'common/quickcontext';
import { map, isObject, find, isUndefinedOrNull } from 'common/utils';
import { useDropdownToggle } from 'common/ui/dropdown';

const [ useSelectContext, SelectProvider, SelectContext ] = quickContext('SelectContext', ({
  value,
  lookup,
  options,
  onChange,
  multiple,
  combobox,
  ...rest
}) => {
  if (!value) value = [];
  else if (!Array.isArray(value)) value = [ value ];

  const [ values ] = useDerivedSet(() => value.map((v) => lookup[v] || { value: v }), value);

  const { current: sm } = useComputedRef(() => new SelectionManager);
  sm._values = values;
  sm._onChange = onChange;
  sm._options = options;
  sm._multiple = multiple;
  sm._combobox = combobox;

  const [ toggleProps, { show, toggle: toggleMenu } ] = useDropdownToggle();

  return {
    selection: sm,
    lookup,
    options,
    toggleProps,
    show,
    toggleMenu,
    multiple,
    combobox,
    ...rest,
  };
});

export default useSelectContext;
export {
  SelectProvider,
  SelectContext,
};


class SelectionManager {

  get empty () {
    return !this._values.size;
  }

  get flatValues () {
    return map(this._values, 'value');
  }

  get values () {
    return [ ...this._values ];
  }

  clear () {
    this._values.clear();
    if (this._onChange) {
      if (this._multiple) this._onChange([]);
      else this._onChange(null);
    }
  }

  deselect (value) {
    if (isUndefinedOrNull(value)) return;
    if (!isObject(value)) value = find(this._options, { value });

    if (!this._multiple && this._values.size) {
      this._values.clear();
      this._onChange && this._onChange();
      return;
    }
    if (!value || !this._values.has(value)) return;

    this._values.delete(value);
    this._onChange && this._onChange(this.flatValues);
  }

  select (value) {
    if (isUndefinedOrNull(value)) return;
    if (!isObject(value)) {
      const found = find(this._options, { value });
      if (found && this._values.has(found)) return;
      if (found) value = found;
      else if (this._combobox) value = { value };
      else return;
    }

    if (!this._multiple) {
      this._values.clear();
      this._values.add(value);
      this._onChange && this._onChange(this.flatValues[0]);
      return;
    }

    this._values.add(value);
    this._onChange && this._onChange(this.flatValues);
  }

  toggle (value, to = null) {
    if (!this._multiple) return this.select(value);
    if (isUndefinedOrNull(value)) return;
    if (!isObject(value)) value = find(this._options, { value });

    if (!value) return;

    if (to === null) {
      to = !this._values.has(value);
    }

    if (to) {
      this._values.add(value);
    } else {
      this._values.delete(value);
    }

    if (this._onChange) {
      if (this._multiple) this._onChange(this.flatValues);
      else this._onChange(this._values.size ? this.flatValues[0] : null);
    }
  }

  includes (value) {
    if (!isObject(value)) value = find(this._options, { value });
    return this._values.has(value);
  }

}

export const valuePropType = PropTypes.shape({
  value: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
  caption: PropTypes.children,
  label: PropTypes.string,
  group: PropTypes.string,
});
