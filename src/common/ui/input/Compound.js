import { cl as classNames } from 'common/utils';
import PropTypes from 'common/prop-types';
import { forwardRef, useRef, useCallback } from 'react';
import divWithClassName from 'common/ui/divWithClassName';
import * as styles from './input.scss';
import { cloneChildren } from 'common/children';
import Control from './Control';
import Button from 'common/ui/button';
import Text from 'common/ui/text';
import Grid from 'common/ui/grid';
import useFocus, { FocusProvider } from 'common/ui/focus';
import useMergedRefs, { assignRef } from 'common/hooks/useMergedRefs';

export const CompoundText      = divWithClassName(styles['compound-text'],    'CompoundText', { as: Text, propTypes: Text.propTypes });
export const CompoundButton    = divWithClassName(styles['compound-btn'],     'CompoundButton', {
  as: Button,
  tabIndex: -1,
  propClassMap: {
    prefix: styles['compound-btn-prefix'],
    postfix: styles['compound-btn-postfix'],
  },
  propTypes: {
    ...Button.propTypes,
    prefix: PropTypes.bool,
    postfix: PropTypes.bool,
  },
});
export const CompoundDivider   = divWithClassName(styles['compound-divider'], 'CompoundDivider', { as: Grid.Row.Divider, propTypes: Grid.Row.Divider.propTypes });
export const CompoundSpacer    = divWithClassName(styles['compound-spacer'],  'CompoundSpacer',  { as: Grid.Spacer });

const propTypes = {
  /**
   * Control the size of buttons and form elements from the top-level .
   *
   * @type {('sm'|'lg')}
   */
  size: PropTypes.string,
  as: PropTypes.elementType,
  disabled: PropTypes.bool,
  focusKey: PropTypes.any,

  defaultFocus: PropTypes.refObject,
  onFocusChange: PropTypes.func,
};

const CompoundControl = forwardRef(({
  as = Grid.Row,
  size,
  className,
  children,
  focusKey,
  disabled,
  defaultFocus,
  onFocusChange,
  ...props
}, ref) => {

  var defaultFocusTarget = useRef();
  if (defaultFocus && 'current' in defaultFocus) defaultFocusTarget = defaultFocus;

  var controlRef = useRef();
  var { ref: focusRef } = useFocus(focusKey, true);
  ref = useMergedRefs(controlRef, focusRef, ref);

  const handleFocusChange = useCallback((target, relatedTarget) => {
    if (!target && relatedTarget && defaultFocusTarget.current) defaultFocusTarget.current.focus();
    else if (onFocusChange) onFocusChange(target, relatedTarget);
  });

  children = cloneChildren(children, ({ compoundDefaultFocus, ...cprops }, child) => {
    cprops = {
      ...cprops,
      className: classNames(cprops.className, styles['compound-item']),
    };

    if (child.type.propTypes?.disabled) {
      cprops.disabled = cprops.disabled || disabled;
    }

    if (compoundDefaultFocus) {
      cprops.ref = (node) => {
        assignRef(child.ref, node);
        assignRef(defaultFocusTarget, node);
      };
    }

    return cprops;
  });

  return (
    <FocusProvider focusKey={focusKey} onChange={handleFocusChange}>
      <Control
        ref={ref}
        {...props}
        focusable={!disabled}
        as={as}
        className={classNames(
          className,
          styles.compound,
          size && styles[`compound-${size}`],
        )}
      >{children}
      </Control>
    </FocusProvider>
  );
});
CompoundControl.displayName = 'CompoundControl';
CompoundControl.propTypes = propTypes;

CompoundControl.Text = CompoundText;
CompoundControl.Button = CompoundButton;
CompoundControl.Divider = CompoundDivider;
CompoundControl.Spacer = CompoundSpacer;

export default CompoundControl;
