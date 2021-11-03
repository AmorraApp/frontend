import PropTypes from 'prop-types';
import { cl as classNames } from 'common/utils';
import { forwardRef } from 'react';
import useTripWire from 'common/hooks/useTripWire';
import useOverlayContext from 'common/ui/overlay/useOverlayContext';
import * as styles from './popover.scss';

const PopoverContent = forwardRef(({ mountOnEnter, unmountOnExit, className, children, ...props }, ref) => {
  const { show } = useOverlayContext() || {};
  const hasShown = useTripWire(show);

  if (!hasShown && mountOnEnter) return null;
  if (!show && unmountOnExit) return null;

  return (
    <div {...props} ref={ref} className={classNames(className, styles['popover-body'])}>
      {children}
    </div>
  );
});
PopoverContent.displayName = 'PopoverContent';
PopoverContent.propTypes = {
  /**
     * Wait until the first "enter" transition to mount tabs (add them to the DOM)
     */
  mountOnEnter: PropTypes.bool,

  /**
     * Unmount tabs (remove it from the DOM) when it is no longer visible
     */
  unmountOnExit: PropTypes.bool,
};

export default PopoverContent;
