
import PropTypes from 'prop-types';
import { useCallback } from 'react';
import useDerivedState from 'common/hooks/useDerivedState';
import { CompoundControl, TextField } from 'common/ui/input';
import SearchIcon from 'common/svgs/solid/search.svg';
import CloseButton from 'common/ui/close-button';

const propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  onClear: PropTypes.func,
  clearable: PropTypes.bool,
  variant: CompoundControl.Button.propTypes.variant,
  label: PropTypes.node,
  icon: PropTypes.node,
};

const SearchBox = ({
  value: oValue = '',
  onChange,
  onSubmit,
  onClear,
  clearable,
  variant = 'input',
  label = 'Search',
  icon = <SearchIcon />,
  ...props
}) => {
  const [ value, setValue, getValue ] = useDerivedState(oValue, [ oValue ]);

  const handleClear = useCallback(() => {
    setValue('');
    onChange && onChange('');
    onClear && onClear();
  }, [ onChange, onClear ]);

  const handleChange = useCallback((v) => {
    setValue(v);
    onChange && onChange(v);
  }, [ onChange ]);

  const handleSubmit = useCallback(() => {
    onSubmit && onSubmit(getValue());
  }, [ onSubmit ]);

  return (
    <CompoundControl {...props}>
      <CompoundControl.Text>{icon}</CompoundControl.Text>
      <CompoundControl.Divider />
      <TextField value={value} onChange={handleChange} onEnterKey={handleSubmit} compoundDefaultFocus />
      {clearable && value && (
        <>
          <CompoundControl.Spacer />
          <CloseButton onClick={handleClear} tabIndex={-1} />
          <CompoundControl.Spacer />
        </>
      )}
      {!!label && <CompoundControl.Button variant={variant} postfix onClick={handleSubmit}>{label}</CompoundControl.Button>}
    </CompoundControl>
  );
};
SearchBox.propTypes = propTypes;

export default SearchBox;
