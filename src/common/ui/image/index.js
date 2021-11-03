import { cl as classNames, isString, map, isObject, isArray } from 'common/utils';
import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import * as styles from './image.scss';
import Placeholder from './Placeholder';
import Preload from './Preload';

const ROUNDED = [
  true,
  'sm',
  'top',
  'right',
  'bottom',
  'left',
  'lg',
  'circle',
  'pill',
];

const THEMES = [
  'gray',
  'social',
  'industrial',
  'sky',
  'vine',
  'lava',
];

export const propTypes = {

  /**
     * Sets image as fluid image.
     */
  fluid: PropTypes.bool,

  /**
     * Sets image shape as rounded.
     */
  rounded: PropTypes.oneOf(ROUNDED),

  /**
     * Sets image shape as thumbnail.
     */
  thumbnail: PropTypes.bool,

  src: PropTypes.string,

  srcSet: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
  ]),

  sizes: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),

  placeholder: PropTypes.bool,

  spinner: Preload.propTypes.spinner,
  onLoad: PropTypes.func,

  ...Placeholder.propTypes,
};


const Image = forwardRef(({
  className,
  fluid,
  rounded,
  thumbnail,
  placeholder,

  src,
  srcSet,
  sizes,

  spinner,
  onLoad,

  ...props
}, ref) => {

  if (isObject(srcSet)) {
    srcSet = map(srcSet, (url, width) => [ url, width ].filter(Boolean).join(' ')).filter(Boolean).join(', ');
  }

  if (isArray(sizes)) {
    sizes = sizes.join(', ');
  }

  const classes = classNames(
    className,
    styles.img,
    fluid && styles['img-fluid'],
    rounded === true && styles.rounded,
    rounded && isString(rounded) && styles[`rounded-${rounded}`],
    thumbnail && styles['img-thumbnail'],
  );

  if (placeholder) {
    return <Placeholder ref={ref} {...props} className={classes} />;
  }

  if (spinner) {
    return (
      <Preload src={src} spinner={spinner} onLoad={onLoad} className={className}>
        <img ref={ref} {...props} {...{ src, srcSet, sizes }} className={classes} />
      </Preload>
    );
  }

  return <img ref={ref} {...props} {...{ src, srcSet, sizes }} className={classes} onLoad={onLoad} />;
});
Image.displayName = 'Image';
Image.propTypes = propTypes;
Image.ROUNDED = ROUNDED;
Image.THEMES = THEMES;
export default Image;
