import { cl as classNames } from 'common/utils';
import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import divWithClassName from '../divWithClassName';
import * as styles from './input.scss';
import { cloneChildren } from 'common/children';
import Button from 'common/ui/button';

export const InputGroupAppend  = divWithClassName(styles['input-group-append'], 'InputGroupAppend');
export const InputGroupPrepend = divWithClassName(styles['input-group-prepend'], 'InputGroupPrepend');
export const InputGroupBetween = divWithClassName(classNames(styles['input-group-append'], styles['input-group-prepend']), 'InputGroupBetween');
export const InputGroupText    = divWithClassName(styles['input-group-text'], 'InputGroupText', { as: 'span' });
export const InputGroupButton  = ({ className, ...props }) => (
  <Button {...props} className={classNames(className, styles['input-group-btn'])} />
);
export const InputGroupCheckbox = (props) => (
  <InputGroupText><input type="checkbox" {...props} /></InputGroupText>
);
export const InputGroupRadio = (props) => (
  <InputGroupText>
    <input type="radio" {...props} />
  </InputGroupText>
);

const propTypes = {
  /**
   * Control the size of buttons and form elements from the top-level .
   *
   * @type {('sm'|'lg')}
   */
  size: PropTypes.string,
  as: PropTypes.elementType,
};

/**
 *
 * @property {InputGroupAppend} Append
 * @property {InputGroupPrepend} Prepend
 * @property {InputGroupText} Text
 * @property {InputGroupRadio} Radio
 * @property {InputGroupCheckbox} Checkbox
 */
const InputGroup = forwardRef(({
  size,
  className,
  as: Component = 'div',
  children,
  ...props
}, ref) => {

  children = cloneChildren(children, (cprops) => ({
    ...cprops,
    className: classNames(cprops.className, styles['input-group-item']),
  }));

  return (
    <Component
      ref={ref}
      {...props}
      className={classNames(
        className,
        styles['input-group'],
        size && styles[`input-group-${size}`],
      )}
    >{children}</Component>
  );
});

InputGroup.propTypes = propTypes;
InputGroup.displayName = 'InputGroup';

InputGroup.Text     = InputGroupText;
InputGroup.Radio    = InputGroupRadio;
InputGroup.Checkbox = InputGroupCheckbox;
InputGroup.Button   = InputGroupButton;
InputGroup.Append   = InputGroupAppend;
InputGroup.Prepend  = InputGroupPrepend;
InputGroup.Between  = InputGroupBetween;

export default InputGroup;
