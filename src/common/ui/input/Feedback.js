import { cl as classNames } from 'common/utils';
import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import * as styles from './input.scss';

const propTypes = {
  /**
     * Specify whether the feedback is for valid or invalid fields
     *
     * @type {('valid'|'invalid')}
     */
  type: PropTypes.string,
  /** Display feedback as a tooltip. */
  tooltip: PropTypes.bool,
  as: PropTypes.elementType,
};

const Feedback = forwardRef(({
  as: Component = 'div',
  className,
  type = 'valid',
  tooltip = false,
  ...props
}, ref) => (
  <Component {...props} ref={ref} className={classNames(className, styles[`${type}-${tooltip ? 'tooltip' : 'feedback'}`])} />
));

Feedback.displayName = 'Feedback';
Feedback.propTypes = propTypes;
export default Feedback;
