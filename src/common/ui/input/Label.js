import { cl as classNames } from 'common/utils';
import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import useInputContext from './useInputContext';
import * as styles from './input.scss';
import Text from 'common/ui/text';

const propTypes = {
  /**
     * Uses `controlId` from InputContext if not explicitly specified.
     */
  htmlFor: PropTypes.string,

  /** Set a custom element for this component */
  as: PropTypes.elementType,

  nowrap: PropTypes.bool,

  disabled: PropTypes.bool,
};

const Label = forwardRef(({
  as = 'label',
  className,
  nowrap,
  htmlFor,
  disabled,
  ...props
}, ref) => {
  const { controlId, disabled: contextDisabled } = useInputContext();

  const classes = classNames([
    className,
    styles['form-label'],
    nowrap && styles['form-label-nowrap'],
    disabled || contextDisabled && styles.disabled,
  ]);

  return (
    <Text as={as} ref={ref} className={classes} htmlFor={htmlFor || controlId} {...props} />
  );
});
Label.displayName = 'Label';
Label.propTypes = propTypes;
export default Label;
