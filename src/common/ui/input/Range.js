import { forwardRef } from 'react';
import BaseInput from './BaseInput';

const Range = forwardRef((props, ref) => <BaseInput {...props} ref={ref} type="range" />);
Range.displayName = 'Range';
export default Range;
