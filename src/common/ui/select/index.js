
import { keyBy, isObject, isArray, isNumber, isString, isMap, isSet, deepEqual } from 'common/utils';
import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import useChildren from 'common/hooks/useChildren';
import useStableMemo from 'common/hooks/useStableMemo';
import Feedback from 'common/ui/input/Feedback';
import useInputContext from 'common/ui/input/useInputContext';
import { mapChildren } from 'common/children';
import { SelectProvider, valuePropType } from './useSelectContext';
import Dropdown from 'common/ui/dropdown';
import SelectInternal from './SelectInternal';
import styles from './select.scss';

const propTypes = {
  /**
   * Size variants
   *
   * @type {('sm'|'lg')}
   */
  size: PropTypes.string,

  /**
   * The wrapping HTML element to use when rendering the FormControl.
   */
  as: PropTypes.elementType,

  /** Make the control readonly */
  readOnly: PropTypes.bool,

  /** Make the control disabled */
  disabled: PropTypes.bool,

  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.oneOfType([ PropTypes.string, PropTypes.number ])),
  ]),

  multiple: PropTypes.bool,
  clearable: PropTypes.bool,
  combobox: PropTypes.bool,

  options: PropTypes.oneOfType([
    PropTypes.instanceOf(Map),
    PropTypes.instanceOf(Set),
    PropTypes.arrayOf(
      PropTypes.oneOfType([
        valuePropType,
        PropTypes.arrayOf(valuePropType),
        PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
      ]),
    ),
    PropTypes.objectOf(PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ])),
  ]),

  onChange: PropTypes.func,

  /**
     * Uses `controlId` from `<FormGroup>` if not explicitly specified.
     */
  id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]),

  /** Add "valid" validation styles to the control */
  isValid: PropTypes.bool,

  /** Add "invalid" validation styles to the control and accompanying label */
  isInvalid: PropTypes.bool,

  name: PropTypes.string,
  autoComplete: PropTypes.bool,

  onKeyDown: PropTypes.func,
  onKeyUp: PropTypes.func,
  onKeyPress: PropTypes.func,
  onInputChange: PropTypes.func,

  drop:  PropTypes.oneOf([ 'up', 'left', 'right', 'down', 'top', 'bottom' ]),
  align: PropTypes.oneOf([ 'start', 'center', 'end' ]),

  focusKey: PropTypes.any,
};

const Select = forwardRef(({
  id,
  value: oValue,
  children,
  onChange,
  ...props
}, ref) => {
  const { controlId } = useInputContext();
  id = id || controlId;

  const derivedOptions = useChildren(children, () => parseChildren(children));

  const {
    name,
    autoComplete,
    as,
    size,
    isValid,
    isInvalid,
    disabled,
    readOnly,
    style,
    onKeyDown,
    onKeyUp,
    onKeyPress,
    onInputChange,
    options: originalOptions,
    ...rest
  } = props;

  const inputProps = {
    onKeyDown,
    onKeyUp,
    onKeyPress,
    onInputChange,
  };

  const formControlProps = {
    as,
    size,
    isValid,
    isInvalid,
    disabled,
    readOnly,
    style,
  };

  const selectProps = {
    name,
    autoComplete,
  };

  const options = useStableMemo(
    () => parseOptionsInput(originalOptions, derivedOptions),
    [ originalOptions, derivedOptions ],
    deepEqual,
  );
  const lookup = useStableMemo(() => keyBy(options, 'value'), [ options ]);

  return (
    <Dropdown ref={ref} className={styles.select} showClassName={styles.show} disabled={disabled}>
      <SelectProvider
        {...rest}
        onChange={onChange}
        options={options}
        value={oValue}
        lookup={lookup}
        id={id}
        disabled={disabled}
      >
        <SelectInternal
          controlProps={formControlProps}
          selectProps={selectProps}
          inputProps={inputProps}
        />
      </SelectProvider>
    </Dropdown>
  );
});
Select.displayName = 'Select';
Select.propTypes = propTypes;
export default Object.assign(Select, { Feedback });

function parseChildren (children, opts) {
  return mapChildren(children, (child) => {
    if (child.type === 'optgroup') {
      const { children: optchildren, label: group, ...childprops } = child.props;
      return parseChildren(optchildren, { group, ...childprops });
    }

    if (child.type !== 'option') return;
    return {
      ...opts,
      value: child.props.value,
      caption: child.props.children,
      label: child.props.label,
    };
  }).flat(Infinity);
}

function parseArrayItem (item) {
  if (isArray(item)) return parseArrayItem(item);
  if (isString(item) || isNumber(item)) return { value: item };
  if (isObject(item, true)) {
    if (isString(item.value) || isNumber(item.value)) return item;
    return Object.entries(item).map(([ value, caption ]) => ({ value, caption }));
  }
  return null;
}

function parseOptionsInput (originalOptions, derivedOptions) {

  if (!originalOptions) return derivedOptions;

  if (isArray(originalOptions)) {
    if (!originalOptions.length) return derivedOptions;
    return originalOptions.map(parseArrayItem).flat(Infinity).filter(Boolean).concat(derivedOptions);
  }

  if (isSet(originalOptions)) {
    if (!originalOptions.size) return derivedOptions;
    return Array.from(originalOptions, parseArrayItem).concat(derivedOptions);
  }

  if (isMap(originalOptions)) {
    if (!originalOptions.size) return derivedOptions;
    return Array.from(originalOptions.entries(), ([ value, caption ]) => ({ value, caption })).concat(derivedOptions);
  }

  if (isObject(originalOptions, true)) {
    return Object.entries(originalOptions).map(([ value, caption ]) => ({ value, caption })).concat(derivedOptions);
  }
}
