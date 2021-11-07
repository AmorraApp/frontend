
import PropTypes from 'common/prop-types';
import { forwardRef } from 'react';
import { cl as classNames } from 'common/utils';

import styles from './panelstack.scss';

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

const PanelHeader = forwardRef(({
  className,
  children,
  ...props
}, ref) => (
  <div
    {...props}
    ref={ref}
    className={classNames(styles.header, className)}
  >{children}</div>
));
PanelHeader.displayName = 'PanelHeader';
PanelHeader.propTypes = propTypes;

export default PanelHeader;
