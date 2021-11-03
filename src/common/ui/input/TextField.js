import { forwardRef } from 'react';
import BaseInput from './BaseInput';

const TextField = forwardRef((props, ref) => <BaseInput {...props} ref={ref} />);
TextField.displayName = 'TextField';
TextField.propTypes = BaseInput.propTypes;
export default TextField;
