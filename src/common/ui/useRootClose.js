
import { useCallback, useRef } from 'react';
import { noop, warning } from 'common/utils';
import { useToggledGlobalListener } from 'common/hooks/useGlobalListener';
const escapeKeyCode = 27;

function isLeftClickEvent (event) {
  return event.button === 0;
}

function isModifiedEvent (event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

const getRefTarget = (ref) => ref && ('current' in ref ? ref.current : ref);

/**
 * The `useRootClose` hook registers your callback on the document
 * when rendered. Powers the `<Overlay/>` component. This is used achieve modal
 * style behavior where your callback is triggered when the user tries to
 * interact with the rest of the document or hits the `esc` key.
 *
 * @param {Ref<HTMLElement>| HTMLElement} ref  The element boundary
 * @param {function} onRootClose
 * @param {object=}  options
 * @param {boolean=} options.disabled
 * @param {string=}  options.clickTrigger The DOM event name (click, mousedown, etc) to attach listeners on
 */
export default function useRootClose (refs, onRootClose = noop, { disabled, clickTrigger = 'click' } = {}) {
  if (!Array.isArray(refs)) refs = [ refs ];
  refs = refs.map(getRefTarget);

  const preventMouseRootCloseRef = useRef(false);

  const handleMouseCapture = useCallback((e) => {
    warning(refs.length && !!refs[0], 'RootClose captured a close event but does not have a ref to compare it to. ' +
            'useRootClose(), should be passed a ref that resolves to a DOM node');

    preventMouseRootCloseRef.current =
      !refs.length ||
      !refs[0] ||
      isModifiedEvent(e) ||
      !isLeftClickEvent(e) ||
      e.composedPath().some((node) => refs.some((r) => node === r))
    ;
  }, refs);

  const handleMouse = useCallback((e) => {
    if (!preventMouseRootCloseRef.current && !disabled) {
      onRootClose(e);
    }
  });

  const handleKeyUp = useCallback((e) => {
    if (e.keyCode === escapeKeyCode && !disabled) {
      onRootClose(e);
    }
  });

  useToggledGlobalListener(clickTrigger, handleMouseCapture, true, refs[0]).when(refs[0]);
  useToggledGlobalListener(clickTrigger, handleMouse, false, refs[0]).when(refs[0]);
  useToggledGlobalListener('keyup', handleKeyUp, true, refs[0]).when(refs[0]);

}
