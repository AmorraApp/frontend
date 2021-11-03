import PropTypes from 'prop-types';
import { useMemo, forwardRef, createContext, useContext } from 'react';
import BaseToggle from './BaseToggle';
import { v4 as uuid } from 'uuid';
import useMemoObject from 'common/hooks/useMemoObject';

export const RadioContext = createContext();
RadioContext.displayName = 'RadioContext';

export function useRadioContext () {
  return useContext(RadioContext) || {};
}

export const RadioGroup = forwardRef(({
  as: Component = null,
  name,
  children,
  ...props
}, ref) => {
  const groupName = useMemo(() => name || uuid().replace(/[^a-zA-Z0-9]/g, '').substr(-8), [ name ]);

  const context = useMemoObject({
    groupName,
  });

  if (!Component) {
    return (
      <RadioContext.Provider value={context}>
        <>{children}</>
      </RadioContext.Provider>
    );
  }

  return (
    <RadioContext.Provider value={context}>
      <Component {...props} ref={ref}>
        {children}
      </Component>
    </RadioContext.Provider>
  );
});
RadioGroup.propTypes = {
  as: PropTypes.elementType,

  /**
   * Sets `name` on radio button inputs
   */
  name: PropTypes.string,
};

const Radio = forwardRef(({ name, ...props }, ref) => {
  const { groupName } = useRadioContext();

  return <BaseToggle {...props} name={name || groupName} ref={ref} type="radio" />;
});
Radio.propTypes = BaseToggle.propTypes;
Radio.displayName = 'Radio';
Radio.VARIANTS = BaseToggle.VARIANTS;
Radio.Group = RadioGroup;
export default Radio;
