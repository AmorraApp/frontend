import { cl as classNames } from 'common/utils';
import { forwardRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import * as styles from './turntable.scss';
import Image from 'common/ui/image';
import useDerivedState from 'common/hooks/useDerivedState';

const TurntableCell = forwardRef(({
  className,
  baseHeight,
  onClick,
  onLoad,
  style,
  ...props
}, ref) => {

  const [ dimensions, setDimensions ] = useDerivedState(false, [ props.src ]);

  const handleLoaded = useCallback((ev) => {
    const { naturalWidth: width, naturalHeight: height } = ev.target;
    setDimensions({ width, height, ratio: height && width / height });
    onLoad && setTimeout(() => onLoad(props, ev));
  });

  const handleClick = useCallback((ev) => onClick && onClick(props, ev));

  const { src, srcSet, sizes } = props;

  if (dimensions && baseHeight) {
    style = { ...style, flexBasis: Math.min(dimensions.width, baseHeight * dimensions.ratio), height: baseHeight };
  } else if (baseHeight) {
    style = { ...style, flexBasis: baseHeight, height: baseHeight };
  }

  return (
    <div
      ref={ref}
      className={classNames(
        className,
        styles.cell,
      )}
      onClick={handleClick}
      style={style}
    >
      <Image spinner {...{ src, srcSet, sizes }} onLoad={handleLoaded} />
    </div>
  );
});
TurntableCell.displayName = 'TurntableCell';
TurntableCell.propTypes = {
  src: PropTypes.string,
  srcSet: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
  ]),
  sizes: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  onClick: PropTypes.func,
  onLoad: PropTypes.func,
  baseHeight: PropTypes.number,
};

export default TurntableCell;
