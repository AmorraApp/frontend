import { forwardRef, Children, cloneElement, useCallback } from 'react';
import PropTypes from 'prop-types';
import { cl } from 'common/utils';
import styles from './collapse.scss';
import Transition, {
  ENTERED,
  ENTERING,
  EXITED,
  EXITING,
} from 'react-transition-group/Transition';
import triggerBrowserReflow from '../triggerBrowserReflow';

export {
  styles as Classes,
};

const MARGINS = {
  height: [ 'margin-top', 'margin-bottom' ],
  width:  [ 'margin-left', 'margin-right' ],
};

function css (node, property) {
  return node.style.getPropertyValue(property) || window.getComputedStyle(node).getPropertyValue(property);
}

const transitionEnd = (node, done) => {
  // use the css transitionend event to mark the finish of a transition
  node.addEventListener('transitionend', done, false);
};

function getDefaultDimensionValue (dimension, elem) {
  const offset = `offset${dimension[0].toUpperCase()}${dimension.slice(1)}`;
  const value = elem[offset];
  const margins = [
    parseInt(css(elem, MARGINS[dimension][0]), 10),
    parseInt(css(elem, MARGINS[dimension][1]), 10),
  ];

  return value + margins[0] + margins[1];
}



const collapseStyles = {
  [ENTERING]: styles.collapsing,
  [ENTERED]: [ styles.collapse, styles.show ],
  [EXITING]: styles.collapsing,
  [EXITED]: styles.collapse,
};

const propTypes = {
  /**
   * Show the component; triggers the expand or collapse animation
   */
  in: PropTypes.bool,

  /**
   * Wait until the first "enter" transition to mount the component (add it to the DOM)
   */
  mountOnEnter: PropTypes.bool,

  /**
   * Unmount the component (remove it from the DOM) when it is collapsed
   */
  unmountOnExit: PropTypes.bool,

  /**
   * Run the expand animation when the component mounts, if it is initially
   * shown
   */
  appear: PropTypes.bool,

  /**
   * Duration of the collapse animation in milliseconds, to ensure that
   * finishing callbacks are fired even if the original browser transition end
   * events are canceled
   */
  timeout: PropTypes.number,

  /**
   * Callback fired before the component expands
   */
  onEnter: PropTypes.func,

  /**
   * Callback fired after the component starts to expand
   */
  onEntering: PropTypes.func,

  /**
   * Callback fired after the component has expanded
   */
  onEntered: PropTypes.func,

  /**
   * Callback fired before the component collapses
   */
  onExit: PropTypes.func,

  /**
   * Callback fired after the component starts to collapse
   */
  onExiting: PropTypes.func,

  /**
   * Callback fired after the component has collapsed
   */
  onExited: PropTypes.func,

  /**
   * The dimension used when collapsing, or a function that returns the
   * dimension
   *
   * _Note: Bootstrap only partially supports 'width'!
   * You will need to supply your own CSS animation for the `.width` CSS class._
   */
  dimension: PropTypes.oneOfType([
    PropTypes.oneOf([ 'height', 'width' ]),
    PropTypes.func,
  ]),

  flex: PropTypes.bool,

  /**
     * ARIA role of collapsible element
     */
  role: PropTypes.string,

  className: PropTypes.string,

  children: PropTypes.oneOfType([ PropTypes.arrayOf(PropTypes.node), PropTypes.node ]),
};

const defaultProps = {
  in: false,
  timeout: 350,
  mountOnEnter: false,
  unmountOnExit: false,
  appear: false,
};

const Collapse = forwardRef(
  (
    {
      onEnter,
      onEntering,
      onEntered,
      onExit,
      onExiting,
      className,
      children,
      dimension = 'height',
      flex,
      ...props
    },
    ref,
  ) => {
    /* Compute dimension */
    const computedDimension = typeof dimension === 'function' ? dimension() : dimension;

    /* -- Expanding -- */
    const handleEnter = useCallback((elem) => {
      elem.style[flex ? 'flexBasis' : computedDimension] = '0';
      if (onEnter) onEnter(elem);
    }, [ onEnter, computedDimension, flex ]);

    const handleEntering = useCallback((elem) => {
      const scroll = `scroll${computedDimension[0].toUpperCase()}${computedDimension.slice(1)}`;
      elem.style[flex ? 'flexBasis' : computedDimension] = `${elem[scroll]}px`;
      if (onEntering) onEntering(elem);
    }, [ onEntering, computedDimension, flex ]);

    const handleEntered = useCallback((elem) => {
      elem.style[flex ? 'flexBasis' : computedDimension] = null;
      if (onEntered) onEntered(elem);
    }, [ onEntered, computedDimension, flex ]);

    const handleExit = useCallback((elem) => {
      const v = getDefaultDimensionValue(computedDimension, elem) + 'px';
      elem.style[flex ? 'flexBasis' : computedDimension] = v;
      triggerBrowserReflow(elem);
      if (onExit) onExit(elem);
    }, [ onExit, computedDimension, flex ]);

    const handleExiting = useCallback((elem) => {
      elem.style[computedDimension] = null;
      if (onExiting) onExiting(elem);
    }, [ onExiting, computedDimension, flex ]);

    return (
      <Transition
        ref={ref}
        addEndListener={transitionEnd}
        {...props}
        aria-expanded={props.role ? props.in : null}
        onEnter={handleEnter}
        onEntering={handleEntering}
        onEntered={handleEntered}
        onExit={handleExit}
        onExiting={handleExiting}
      >
        {(state, innerProps) => Children.map(children, (child) => cloneElement(child, {
          ...innerProps,
          className: cl(
            className,
            child.props.className,
            collapseStyles[state],
            flex ? styles.flex : styles[computedDimension],
          ),
        }))}
      </Transition>
    );
  },
);

Collapse.propTypes = propTypes;
Collapse.defaultProps = defaultProps;
export default Collapse;
