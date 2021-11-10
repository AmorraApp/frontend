
import PropTypes from 'common/prop-types';
import { forwardRef } from 'react';
import useInputContext, { InputContextProvider as Group } from 'common/ui/useInputContext';
import Text from 'common/ui/text';

const Label = forwardRef(({
  as = 'label',
  htmlFor,
  ...props
}, ref) => {
  const { controlId, disabled: contextDisabled } = useInputContext();
  if (props.disabled === undefined && contextDisabled) props.disabled = true;

  return (
    <Text semi-bold {...props} as={as} ref={ref} htmlFor={htmlFor || controlId} />
  );
});
Label.displayName = 'Label';
Label.propTypes = {
  /**
     * Uses `controlId` from InputContext if not explicitly specified.
     */
  htmlFor: PropTypes.string,

  /** Set a custom element for this component */
  as: PropTypes.elementType,

  nowrap: PropTypes.bool,

  disabled: PropTypes.bool,
};

Label.Group = Group;

export default Label;
