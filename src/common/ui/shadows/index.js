
import * as styles from './shadows.scss';

export default function shadow (elevation = 1) {
  return styles[`elevation-${elevation}`];
}

