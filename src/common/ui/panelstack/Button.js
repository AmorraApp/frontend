
import PropTypes from 'common/prop-types';
import { forwardRef, useCallback } from 'react';
import { cl as classNames } from 'common/utils';
import Button from 'common/ui/button';
import AngleRight from 'common/svgs/solid/angle-right.svg';

import * as styles from './panelstack.scss';
import useStackContext from './useStackContext';
import { usePanelContext } from './Panel';

const propTypes = {
  variant: PropTypes.oneOf([ 'flat', 'floating' ]),
  panelKey: PropTypes.string,
  onClick: PropTypes.func,

  /**
   * The underlying HTML element to use when rendering the FormControl.
   *
   * @type {('input'|'textarea'|'select'|elementType)}
   */
  as: PropTypes.elementType,

  children: PropTypes.oneChild,
};

const PanelButton = forwardRef(({
  className,
  variant = 'input',
  panelKey,
  onClick,
  children,
  as = 'div',
  ...props
}, ref) => {

  const { isActive, history } = useStackContext();
  const panel = usePanelContext();

  const handleClick = useCallback((ev) => {
    onClick && onClick(ev);
    if (ev.defaultPrevented) return;

    history.push(panelKey, panel.path);
  }, [ onClick, history ]);

  const active = isActive(panel.path.concat(panelKey));

  return (
    <Button
      {...props}
      key={panelKey}
      ref={ref}
      variant={variant}
      className={classNames(styles.button, className)}
      block
      onClick={handleClick}
      as={as}
      active={active}
    >
      <div className={styles.inner}>{children}</div>
      <div className={styles.arrow}><AngleRight /></div>
    </Button>
  );
});
PanelButton.displayName = 'PanelButton';
PanelButton.propTypes = propTypes;

export default PanelButton;
