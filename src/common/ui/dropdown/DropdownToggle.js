import { cl as classNames, noop } from 'common/utils';
import PropTypes from 'prop-types';
import { forwardRef, useMemo, useCallback } from 'react';
import useMergedRefs from 'common/hooks/useMergedRefs';
import Button from '../button';
import { v4 as uuid } from 'uuid';
import useDropdownContext from './useDropdownContext';

import styles from './dropdown.scss';
export {
  styles as Classes,
};

export function useDropdownToggle () {
  const { show = false, toggle = noop, setToggle } = useDropdownContext() || {};
  const handleClick = useCallback((e) => {
    toggle(!show, e);
  }, [ show, toggle ]);
  return [
    {
      ref: setToggle || noop,
      onClick: handleClick,
      'aria-haspopup': true,
      'aria-expanded': !!show,
    },
    { show, toggle },
  ];
}

const propTypes = {
  id: PropTypes.any,

  'no-caret': PropTypes.bool,

  split: PropTypes.bool,

  as: PropTypes.elementType,

  className: PropTypes.string,
};

const DropdownToggle = forwardRef(({
  id,
  split,
  className,
  as: Component = Button,
  'no-caret': noCaret,
  ...props
}, ref) => {

  const controlId = useMemo(() => id || uuid(), [ id ]);

  const [ toggleProps, { toggle } ] = useDropdownToggle();

  toggleProps.ref = useMergedRefs(toggleProps.ref, ref);
  // This intentionally forwards size and variant (if set) to the
  // underlying component, to allow it to render size and style variants.

  return (
    <Component
      id={controlId}
      onClick={toggle}
      className={classNames(
        className,
        styles['dropdown-toggle'],
        split && styles['dropdown-toggle-split'],
        noCaret && styles['no-caret'],
      )}
      {...toggleProps}
      {...props}
    />);
});
DropdownToggle.displayName = 'DropdownToggle';
DropdownToggle.propTypes = propTypes;
export default DropdownToggle;
