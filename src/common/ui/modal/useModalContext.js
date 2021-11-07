/* eslint react/prop-types:0 */
import { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import useChosenOne from 'common/hooks/useChosenOne';
import usePrevious from 'common/hooks/usePrevious';
import useMergedRefs from 'common/hooks/useMergedRefs';
import useStableMemo from 'common/hooks/useStableMemo';
import useWillUnmount from 'common/hooks/useWillUnmount';
import useGlobalListener from 'common/hooks/useGlobalListener';
import useIsTransitioning from 'common/hooks/useIsTransitioning';
import useWhenElementRefReady from 'common/hooks/useWhenElementRefReady';
import useForceUpdate from 'common/hooks/useForceUpdate';

import * as styles from './modal.scss';
import { cl as classNames } from 'common/utils';
import { BodyMount } from 'common/ui/mount';
import Fade from 'common/ui/fade';
import Manager from './manager';
import Modal from './modalModel';

export const ModalContext = createContext(null);
ModalContext.displayName = 'ModalContext';

export default function useModalContext () {
  return useContext(ModalContext);
}


export function useModal ({ style, className, ...props }, ref) {
  const targetRef = useRef();
  ref = useMergedRefs(ref, targetRef);

  /* eslint-disable no-shadow */
  const { modal, ModalFoundation } = useStableMemo(() => {
    const modal = new Modal(targetRef, Manager);
    const ModalFoundation = (pr) => (<ModalProvider {...pr} modal={modal} />);
    ModalFoundation.displayName = 'ModalFoundation';
    return { modal, ModalFoundation };
  });
  /* eslint-enable no-shadow */


  const [ state, setState ] = useState({
    style: {},
    open: false,
    isOpening: false,
    isClosing: false,
    isForeground: true,
  });

  modal.element = useWhenElementRefReady(targetRef);
  modal.props = props;
  modal.state = state;
  modal._setState = setState;

  style = { ...style, ...state.style };

  const { show } = props;
  const { open, isClosing } = state;
  const { show: prevShow, open: prevOpen } = usePrevious({ show, open }) || { show: false, open: false };
  const isTransitioning = false && useIsTransitioning(targetRef);

  useEffect(() => {
    if (show === prevShow && open === prevOpen) return;
    // nothing to change

    if (show !== prevShow) {
      if (show && !open) {
        // dialog needs to open
        modal.show();
      } else if (!show && open && !isClosing) {
        // dialog needs to close
        modal.hide();
      }
    }
  }, [ modal.element, show, open, prevShow, prevOpen, isClosing ]);

  useWillUnmount(() => modal.dispose());

  useGlobalListener('resize', () => modal._onResize());

  const modalProperties = {
    style,
    ref,
    onClick: useCallback((ev) => {
      if (ev.currentTarget === ev.target && props.backdrop && props.onHide) {
        props.onHide();
      }
    }, [ props.backdrop, props.onHide ]),
    className: classNames(
      className,
      styles.modal,
      state.isClosing && isTransitioning && styles.static,
      !state.isForeground && styles['modal-background'],
    ),
    'aria-hidden': !show && Manager.isLast(modal),
    'aria-modal': show,
    role: show ? 'dialog' : undefined,
  };

  return { modal, ModalFoundation, modalProperties };
}


function Backdrop () {

  const triggerUpdate = useForceUpdate();
  useEffect(() => {
    Manager.stateHooks.add(triggerUpdate);
    return () => Manager.stateHooks.delete(triggerUpdate);
  }, []);


  const handleClick = useCallback(() => {
    const top = Manager.last;
    if (top?.props?.backdrop && top?.props?.onHide) {
      top.props.onHide();
    }
  });

  const animate = Manager.last?.props?.animation;

  useGlobalListener('keydown', useCallback((ev) => {
    if (!Manager.active) return;
    if (ev.key === 'Escape') {
      const top = Manager.last;
      if (top?.props?.keyboard && top?.props?.onHide) {
        top.props.onHide();
      }
    }
  }));

  return (
    <BodyMount source="ModalBackdrop">
      <Fade
        showClass={styles.show}
        fadeClass={styles.fade}
        mountOnEnter
        unmountOnExit
        appear
        in={Manager.active}
      >
        <div
          className={classNames(
            styles.backdrop,
            !animate && styles.show,
          )}
          onClick={handleClick}
        />
      </Fade>
    </BodyMount>
  );
}


function ModalProvider ({
  children,
  modal,
  showClass,
  fadeClass,
}) {

  const Transition = modal.props.transition === true ? Fade : modal.props.transition || Fade;

  const { first } = useChosenOne('ModalBackdrop');

  return (
    <>
      {first && <Backdrop />}
      <ModalContext.Provider value={modal}>
        <BodyMount source="Modal">
          <Transition
            showClass={classNames(styles.show, showClass)}
            fadeClass={classNames(styles.fade, fadeClass)}
            appear
            in={!!modal.props.show}
            onExit={useCallback(() => modal.onExit())}
            onExiting={useCallback(() => modal.onExiting())}
            onExited={useCallback(() => modal.onExited())}
            onEnter={useCallback(() => modal.onEnter())}
            onEntering={useCallback(() => modal.onEntering())}
            onEntered={useCallback(() => modal.onEntered())}
          >
            {children}
          </Transition>
        </BodyMount>
      </ModalContext.Provider>
    </>
  );
}


// function isOverflowing (node) {

//   const isWindow =
//     ('window' in node && node.window === node && node)
//     || (node.nodeType === document.DOCUMENT_NODE && node.defaultView)
//     || false;

//   const doc = isWindow ? document : node.ownerDocument;
//   const win = isWindow || doc.defaultView;

//   const isBody = node.tagName.toLowerCase() === 'body';

//   return isWindow || isBody(node)
//     ? doc.body.clientWidth < win.innerWidth
//     : node.scrollHeight > node.clientHeight;
// }
