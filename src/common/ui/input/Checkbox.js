import { forwardRef } from 'react';
import BaseToggle from './BaseToggle';

const Checkbox = forwardRef((props, ref) => <BaseToggle {...props} ref={ref} type="checkbox" />);
Checkbox.displayName = 'Checkbox';
Checkbox.VARIANTS = BaseToggle.VARIANTS;
export default Checkbox;
