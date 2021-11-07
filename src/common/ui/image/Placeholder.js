import { forwardRef, useRef } from 'react';
import PropTypes from 'prop-types';
import styles from './image.scss';
export { styles as Classes };
import { v4 as uuid } from 'uuid';

const THEMES = [
  'gray',
  'social',
  'industrial',
  'sky',
  'vine',
  'lava',
];

export const propTypes = {
  theme: PropTypes.oneOf(THEMES),
  caption: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
};

const defaultProps = {
  theme: 'gray',
};

const placeholderThemes = {
  'gray': {
    bg1: '#EEEEEE',
    bg2: '#DDDDDD',
    fg: '#AAAAAA',
  },
  'social': {
    bg1: '#3a5a97',
    bg2: '#314b7e',
    fg: '#FFFFFF',
  },
  'industrial': {
    bg1: '#434A52',
    bg2: '#2c3136',
    fg: '#C2F200',
  },
  'sky': {
    bg1: '#0D8FDB',
    bg2: '#0a70ab',
    fg: '#FFFFFF',
  },
  'vine': {
    bg1: '#39DBAC',
    bg2: '#23be91',
    fg: '#1E292C',
  },
  'lava': {
    bg1: '#F8591A',
    bg2: '#d84207',
    fg: '#1C2846',
  },
};

const PlaceholderImage = forwardRef(({
  theme,
  caption,
  ...props
}, ref) => {

  const gid = useRef();
  if (!gid.current) gid.current = uuid();

  const { width, height } = props;
  const { bg1: background1, bg2: background2, fg: foreground } = placeholderThemes[theme];
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${props.width} ${props.height}`} {...props} ref={ref}>
      <defs>
        <linearGradient id={gid.current} x1="0" x2="0" y1="1" y2="1">
          <stop offset="0%" stopColor={background1} />
          <stop offset="100%" stopColor={background2} />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width={width} height={height} fill={`url(#${gid.current})`} />
      <text alignmentBaseline="middle" textAnchor="middle" x={width / 2} y={height / 2} fill={foreground}>{caption || `${width}x${height}`}</text>
    </svg>
  );
});
PlaceholderImage.displayName = 'PlaceholderImage';
PlaceholderImage.propTypes = propTypes;
PlaceholderImage.defaultProps = defaultProps;
PlaceholderImage.THEMES = THEMES;
export default PlaceholderImage;
