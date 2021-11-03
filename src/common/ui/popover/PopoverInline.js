import PropTypes from 'prop-types';
import { Children, forwardRef } from 'react';
import OverlayTrigger from '../overlay/OverlayTrigger';
import Popover from './Popover';

const propTypes = {
  ...Popover.propTypes,

  /**
     * The visibility of the Popover. `show` is a _controlled_ prop so should be paired
     * with `onToggle` to avoid breaking user interactions.
     *
     * Manually toggling `show` does **not** wait for `delay` to change the visibility.
     *
     * @controllable onToggle
     */
  show: PropTypes.bool,

  /**
     * Specify which action or actions trigger Popover visibility
     *
     * @type {'hover' | 'click' |'focus' | Array<'hover' | 'click' |'focus'>}
     */
  trigger: PropTypes.oneOfType([
    PropTypes.oneOf([ 'click', 'hover', 'focus' ]),
    PropTypes.arrayOf(
      PropTypes.oneOf([ 'click', 'hover', 'focus' ]),
    ),
  ]),

  /**
     * A millisecond delay amount to show and hide the Popover once triggered
     */
  delay: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.shape({
      show: PropTypes.number,
      hide: PropTypes.number,
    }),
  ]),

  /**
     * The initial visibility state of the Popover.
     */
  defaultShow: PropTypes.bool,

  /**
     * A callback that fires when the user triggers a change in tooltip visibility.
     *
     * `onToggle` is called with the desired next `show`, and generally should be passed
     * back to the `show` prop. `onToggle` fires _after_ the configured `delay`
     *
     * @controllable `show`
     */
  onToggle: PropTypes.func,
};

const defaultProps = {
  ...OverlayTrigger.defaultProps,
  ...Popover.defaultProps,
};


const PopoverInline = forwardRef(({ children, trigger, delay, defaultShow, ...props }, ref) => {
  children = Children.toArray(children);
  const triggerComponent = children.shift();


  return (
    <>
      <OverlayTrigger
        placement={props.placement}
        trigger={trigger}
        delay={delay}
        defaultShow={defaultShow}
        rootClose
        rootCloseEvent="mousedown"
        overlay={
          <Popover {...props} ref={ref}>
            {children}
          </Popover>
        }
      >{triggerComponent}</OverlayTrigger>
    </>
  );
});

PopoverInline.displayName = 'PopoverInline';
PopoverInline.propTypes = propTypes;
PopoverInline.defaultProps = defaultProps;

export default PopoverInline;
