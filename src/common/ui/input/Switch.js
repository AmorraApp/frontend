import { forwardRef } from 'react';
import BaseToggle from './BaseToggle';

const Switch = forwardRef((props, ref) => <BaseToggle {...props} ref={ref} type="switch" />);
Switch.displayName = 'Switch';
Switch.VARIANTS = BaseToggle.VARIANTS;

export default Switch;

