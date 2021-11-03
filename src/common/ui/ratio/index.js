import { forwardRef, Children } from 'react';
import { cl as classNames, isString, warn } from 'common/utils';
import PropTypes from 'prop-types';
import * as styles from './ratio.scss';

const RATIO_REGEX = /^(\d+)[^\d\s](\d+)$/;

const propTypes = {
  /**
   * This component requires a single child element
   */
  children: PropTypes.element.isRequired,

  /**
   * Set the aspect ration of the embed
   */
  aspectRatio: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),

  contain: PropTypes.bool,

  innerClassName: PropTypes.string,
  innerStyle: PropTypes.object,
};

const defaultProps = {
  aspectRatio: 1,
};

const Ratio = forwardRef(({
  className,
  children,
  aspectRatio,
  style,
  ...props
}, ref) => {

  if (isString(aspectRatio)) {
    const [ matched, w, h ] = RATIO_REGEX.exec(aspectRatio);
    if (!matched) {
      warn('"%s" is not a recognized aspect ratio.', aspectRatio);
      return null;
    }
    aspectRatio = h / w;
  }

  return (
    <div
      ref={ref}
      {...props}
      style={{
        ...style,
        '--aspect-ratio': toPercent(aspectRatio),
      }}
      className={classNames(
        styles.ratio,
        className,
      )}
    >
      {Children.only(children)}
    </div>
  );
});
Ratio.displayName = 'Ratio';
Ratio.propTypes = propTypes;
Ratio.defaultProps = defaultProps;
export default Ratio;

function toPercent (num) {
  if (num <= 0 || num > 1) return '100%';
  return `${num * 100}%`;
}
