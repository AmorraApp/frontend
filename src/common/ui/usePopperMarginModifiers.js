import { useCallback, useMemo, useRef } from 'react';

function hasClass (element, className) {
  if (element.classList) return !!className && element.classList.contains(className);
  return (" " + (element.className.baseVal || element.className) + " ").indexOf(" " + className + " ") !== -1;
}

import popoverClasses from './popover/popover.scss';
import dropdownClasses from './dropdown/dropdown.scss';

function getMargins (element) {
  const styles = window.getComputedStyle(element);
  const top = parseFloat(styles.marginTop) || 0;
  const right = parseFloat(styles.marginRight) || 0;
  const bottom = parseFloat(styles.marginBottom) || 0;
  const left = parseFloat(styles.marginLeft) || 0;
  return { top, right, bottom, left };
}

export default function usePopperMarginModifiers () {
  const overlayRef = useRef(null);
  const margins = useRef(null);
  const popoverClass = popoverClasses.popover;
  const dropdownMenuClass = dropdownClasses['dropdown-menu'];

  const callback = useCallback((overlay) => {
    if (!overlay ||
      !(hasClass(overlay, popoverClass) ||
          hasClass(overlay, dropdownMenuClass))) { return; }

    margins.current = getMargins(overlay);
    overlay.style.margin = '0';
    overlayRef.current = overlay;
  }, [ popoverClass, dropdownMenuClass ]);

  const offset = useMemo(() => ({
    name: 'offset',
    options: {
      offset: ({ placement }) => {
        if (!margins.current) { return [ 0, 0 ]; }
        const { top, left, bottom, right } = margins.current;
        switch (placement.split('-')[0]) {
        case 'top':
          return [ 0, bottom ];
        case 'left':
          return [ 0, right ];
        case 'bottom':
          return [ 0, top ];
        case 'right':
          return [ 0, left ];
        default:
          return [ 0, 0 ];
        }
      },
    },
  }), [ margins ]);

  // Converts popover arrow margin to arrow modifier padding
  const popoverArrowMargins = useMemo(() => ({
    name: 'popoverArrowMargins',
    enabled: true,
    phase: 'main',
    requiresIfExists: [ 'arrow' ],
    fn: () => {},
    effect ({ state }) {
      if (!overlayRef.current ||
        !state.elements.arrow ||
        !hasClass(overlayRef.current, popoverClass) ||
        !state.modifiersData['arrow#persistent']
      ) {
        return undefined;
      }
      const { top, right } = getMargins(state.elements.arrow);
      const padding = top || right;
      state.modifiersData['arrow#persistent'].padding = {
        top: padding,
        left: padding,
        right: padding,
        bottom: padding,
      };
      state.elements.arrow.style.margin = '0';
      return () => {
        if (state.elements.arrow) { state.elements.arrow.style.margin = ''; }
      };
    },
  }), [ popoverClass ]);

  return [ callback, [ offset, popoverArrowMargins ] ];
}
