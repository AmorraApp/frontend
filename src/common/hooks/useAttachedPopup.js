
import { useState } from 'react';
import usePopper from './usePopper';
import useUpdateEffect from './useGettableState';

export default function useAttachedPopup ({
  flip,
  placement,
  show,
}) {

  const [ targetElement, setTargetElement ] = useState(null);
  const [ popperElement, setPopperElement ] = useState(null);
  const { styles: popperStyles, attributes: popperAttributes, update: updatePopper } = usePopper(targetElement, popperElement, {
    placement,
    flip,
  });

  useUpdateEffect(updatePopper, [ show ]);

  return {
    updatePopper,
    popupProps: {
      ...popperAttributes,
      ref: setPopperElement,
      styles: popperStyles,
    },
    targetProps: {
      ref: setTargetElement,
    },
  };
}
