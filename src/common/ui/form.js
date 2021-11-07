
import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import { cl } from 'common/utils';
import styles from 'common/ui/input/input.scss';

const propTypes = {
  as: PropTypes.elementType,
  action: PropTypes.string,
  method: PropTypes.oneOf([ 'get', 'post' ]),
  validated: PropTypes.bool,
};

const defaultProps = {
  method: 'post',
};

const Form = forwardRef(({
  as: Component = 'form',
  validated,
  className,
  ...props
}, ref) => (
  <Component {...props} className={cl(className, validated && styles['was-validated'])} ref={ref} />
));

Form.displayName = 'Form';
Form.propTypes = propTypes;
Form.defaultProps = defaultProps;
export default Form;
