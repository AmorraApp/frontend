
import PropTypes from 'common/prop-types';
import { forwardRef, useRef } from 'react';
import { cl as classNames } from 'common/utils';

import styles from './panelstack.scss';
import { PanelStackProvider } from './useStackContext';

const propTypes = {
  variant: PropTypes.oneOf([ 'flat', 'floating' ]),

  initialPath: PropTypes.string,

  children: PropTypes.oneChild,
};

const PanelStack = forwardRef(({
  className,
  children,
  ...props
}, ref) => {

  const trackRef = useRef();

  return (
    <PanelStackProvider track={trackRef} {...props} >
      <div ref={ref} className={classNames(styles.stack, className)}>
        <div ref={trackRef} className={styles.track}>
          {children}
        </div>
      </div>
    </PanelStackProvider>
  );
});
PanelStack.displayName = 'PanelStack';
PanelStack.propTypes = propTypes;

export default PanelStack;
