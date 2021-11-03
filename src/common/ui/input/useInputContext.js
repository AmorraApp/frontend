import PropTypes from 'prop-types';
import { forwardRef, createContext, useContext, useMemo } from 'react';
import useMemoObject from 'common/hooks/useMemoObject';
import { v4 as uuid } from 'uuid';

export const InputContext = createContext({
  controlId: undefined,
});
InputContext.displayName = 'InputContext';

export default function useInputContext () {
  return useContext(InputContext) || {};
}



const propTypes = {
  as: PropTypes.elementType,

  /**
   * Sets `id` on form inputs and `htmlFor` on form labels.
   */
  controlId: PropTypes.string,

  /** Use Bootstrap's custom form elements to replace the browser defaults */
  custom: PropTypes.bool,

  /** Disable the controls and labels in this group */
  disabled: PropTypes.bool,
};

export const InputContextProvider = forwardRef(({
  children,
  controlId,
  custom,
  disabled,
  as: Component = null,
  ...props
}, ref) => {
  const previousContext = useInputContext();

  const id = useMemo(() => controlId || previousContext?.controlId || uuid().replace(/[^a-zA-Z0-9]/g, '').substr(-8), [ controlId, previousContext.controlid ]);

  const context = useMemoObject({
    ...previousContext,
    controlId: id,
    custom,
    disabled,
  });

  if (!Component) {
    return (
      <InputContext.Provider value={context}>
        <>{children}</>
      </InputContext.Provider>
    );
  }

  return (
    <InputContext.Provider value={context}>
      <Component {...props} ref={ref}>
        {children}
      </Component>
    </InputContext.Provider>
  );
});
InputContextProvider.displayName = 'InputContextProvider';
InputContextProvider.propTypes = propTypes;
