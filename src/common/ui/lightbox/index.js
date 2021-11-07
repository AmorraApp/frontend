import PropTypes from 'prop-types';
import { forwardRef, useCallback } from 'react';

import styles from './lightbox.scss';
import { cl as classNames, map, isObject } from 'common/utils';
import useDerivedState from 'common/hooks/useDerivedState';

import { useModal } from 'common/ui/modal/useModalContext';
import ChevronLeft from 'common/svgs/solid/chevron-left.svg';
import ChevronRight from 'common/svgs/solid/chevron-right.svg';
import Spinner from 'common/ui/spinner';
import CloseButton from 'common/ui/close-button';

const propTypes = {

  /**
   * Close the modal when escape key is pressed
   */
  keyboard: PropTypes.bool,

  /**
   * Close the modal when backdrop is clicked
   */
  backdrop: PropTypes.bool,

  /**
   * Open and close the Modal with a fade animation.
   */
  animation: PropTypes.bool,

  /**
   * Add an optional extra class name to img tag
   */
  contentClassName: PropTypes.string,

  src: PropTypes.string,
  srcSet: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
  ]),
  sizes: PropTypes.string,

  nextKey: PropTypes.any,
  prevKey: PropTypes.any,

  /**
   * When `true` The modal will show itself.
   */
  show: PropTypes.bool,

  /**
   * A callback fired when the Modal is opening.
   */
  onShow: PropTypes.func,

  /**
   * A callback fired when the header closeButton or non-static backdrop is
   * clicked. Required if either are specified.
   */
  onHide: PropTypes.func,

  onChange: PropTypes.func,

  /**
   * A callback fired when the escape key, if specified in `keyboard`, is pressed.
   */
  onEscapeKeyDown: PropTypes.func,

  /**
   * Callback fired before the Modal transitions in
   */
  onEnter: PropTypes.func,

  /**
   * Callback fired as the Modal begins to transition in
   */
  onEntering: PropTypes.func,

  /**
   * Callback fired after the Modal finishes transitioning in
   */
  onEntered: PropTypes.func,

  /**
   * Callback fired right before the Modal transitions out
   */
  onExit: PropTypes.func,

  /**
   * Callback fired as the Modal begins to transition out
   */
  onExiting: PropTypes.func,

  /**
   * Callback fired after the Modal finishes transitioning out
   */
  onExited: PropTypes.func,

  /**
   * A ModalManager instance used to track and manage the state of open
   * Modals. Useful when customizing how modals interact within a container
   */
  manager: PropTypes.object,

  /**
   * @private
   */
  container: PropTypes.any,

  'aria-labelledby': PropTypes.any,
  style: PropTypes.object,
  className: PropTypes.string,
  children: PropTypes.oneOfType([ PropTypes.arrayOf(PropTypes.node), PropTypes.node ]),
};

const defaultProps = {
  show: false,
  backdrop: true,
  keyboard: true,
  autoFocus: true,
  animation: true,
};

const Lightbox = forwardRef(({
  'aria-labelledby': ariaLabelledby,

  src,
  srcSet,
  sizes,
  nextKey,
  prevKey,

  className,
  contentClassName,

  onChange,

  children,
  ...props
}, ref) => {

  const {
    ModalFoundation,
    modalProperties,
  } = useModal({ className: styles.lightbox, ...props, backdrop: true, keyboard: true }, ref);

  if (srcSet && isObject(srcSet)) {
    srcSet = map(srcSet, (url, width) => [ url, width ].filter(Boolean).join(' ')).filter(Boolean).join(', ');
  }

  const [ loaded, setLoaded ] = useDerivedState(() => false, [ src ]);
  const handleImageLoaded = useCallback(() => setLoaded(true));

  if (!children) {
    children = (
      <>
        { !loaded && <Spinner animation="border" size="xl" className={styles.spinner} />}
        <img src={src} srcSet={srcSet} sizes={sizes} onLoad={handleImageLoaded} />
      </>
    );
  }

  const handlePrevClick = useCallback(() => {
    onChange && onChange(prevKey);
  }, [ onChange, prevKey ]);

  const handleNextClick = useCallback(() => {
    onChange && onChange(nextKey);
  }, [ onChange, nextKey ]);

  const handleClose = useCallback(() => {
    props.onHide && props.onHide();
  });

  return (
    <ModalFoundation showClass={styles.show} fadeClass={styles.hide}>
      <div
        {...modalProperties}
        aria-labelledby={ariaLabelledby}
      >
        <div
          className={classNames(
            className,
            styles['lightbox-container'],
          )}
        >
          <CloseButton className={styles.close} size="xl" variant="outline" onClick={handleClose} />
          {!!prevKey && (
            <div className={styles['lightbox-prev']} onClick={handlePrevClick}><ChevronLeft /></div>
          )}
          <div className={classNames(styles['lightbox-content'], contentClassName, loaded ? styles.loaded : styles['not-loaded'])}>
            {children}
          </div>
          {!!nextKey && (
            <div className={styles['lightbox-next']} onClick={handleNextClick}><ChevronRight /></div>
          )}
        </div>
      </div>
    </ModalFoundation>
  );

});

Lightbox.displayName = 'Lightbox';
Lightbox.propTypes = propTypes;
Lightbox.defaultProps = defaultProps;

export default Lightbox;
