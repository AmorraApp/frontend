import PropTypes from 'prop-types';
import { cl } from 'common/utils';
import styles from './fade.scss';
import { forwardRef, cloneElement, useCallback } from 'react';
import Transition, {
  ENTERED,
  ENTERING,
} from 'react-transition-group/Transition';
import triggerBrowserReflow from '../triggerBrowserReflow';

export {
  styles as Classes,
};

const propTypes = {
  /**
   * Show the component; triggers the fade in or fade out animation
   */
  in: PropTypes.bool,

  /**
   * Wait until the first "enter" transition to mount the component (add it to the DOM)
   */
  mountOnEnter: PropTypes.bool,

  /**
   * Unmount the component (remove it from the DOM) when it is faded out
   */
  unmountOnExit: PropTypes.bool,

  /**
   * Run the fade in animation when the component mounts, if it is initially
   * shown
   */
  appear: PropTypes.bool,

  /**
   * The duration for the transition, in milliseconds.
   * You may specify a single timeout for all transitions, or individually with an object.
   * @default {
   *   enter: duration.enteringScreen,
   *   exit: duration.leavingScreen,
   * }
   */
  timeout: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.shape({
      appear: PropTypes.number,
      enter: PropTypes.number,
      exit: PropTypes.number,
    }),
  ]),

  onEnter: PropTypes.func,
  onEntering: PropTypes.func,
  onEntered: PropTypes.func,
  onExit: PropTypes.func,
  onExiting: PropTypes.func,
  onExited: PropTypes.func,

  showClass: PropTypes.string,
  fadeClass: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.oneOfType([ PropTypes.arrayOf(PropTypes.node), PropTypes.node ]),
};

const defaultProps = {
  in: false,
  timeout: 300,
  mountOnEnter: false,
  unmountOnExit: false,
  appear: false,
};

const transitionEnd = (node, done) => {
  // use the css transitionend event to mark the finish of a transition
  node.addEventListener('transitionend', done, false);
};

const Fade = forwardRef(
  ({ className, children, showClass, fadeClass, ...props }, ref) => {
    const handleEnter = useCallback(
      (node) => {
        triggerBrowserReflow(node);
        if (props.onEnter) props.onEnter(node);
      },
      [ props ],
    );

    return (
      <Transition
        ref={ref}
        addEndListener={transitionEnd}
        {...props}
        onEnter={handleEnter}
      >
        {(status, innerProps) =>
          cloneElement(children, {
            ...innerProps,
            className: cl(
              styles.fade,
              fadeClass,
              className,
              children.props.className,
              (status === ENTERING || status === ENTERED) && [ styles.show, showClass ],
            ),
          })
        }
      </Transition>
    );
  },
);

Fade.propTypes = propTypes;
Fade.defaultProps = defaultProps;
Fade.displayName = 'Fade';

export default Fade;
