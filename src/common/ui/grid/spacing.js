
import { isObject } from 'common/utils';
import * as styles from './spacing.scss';

const aliases = {
  margin: 'm',
  padding: 'p',
  all: '',
  top: 't',
  bottom: 'b',
  left: 'l',
  right: 'r',
  horizontal: 'x',
  vertical: 'y',
  small: 'sm',
  medium: 'md',
  large: 'lg',
  xlarge: 'xl',
};

export default function className (property, side = '', size = 'auto', breaker = '') {
  if (isObject(property)) {
    property = { column: 1, side: '', size: 'sm', type: 'col', ...property };
    size = property.size;
    side = property.side;
    breaker = property.breaker;
    property = property.property;
  }
  property = aliases[property] || property;
  size = aliases[size] || size;
  side = aliases[side] || side;
  breaker = aliases[breaker] || breaker;

  const negative = Number(size) < 0 ? 'n' : '';
  const selector = `${property}${side}${breaker && '-' + breaker}-${negative}${size}`;
  return styles[selector];
}

const classes = { ...styles };

const properties = { margin: 'm', padding: 'p' };
const sides = { Top: 't', Bottom: 'b', Left: 'l', Right: 'r', Horizontal: 'x', Vertical: 'y' };
const breaks = { Small: 'sm', Medium: 'md', Large: 'lg', XLarge: 'xl' };
const sizes = [ '1', '2', '3', '4', '5', 'Auto' ];

for (const [ pFull, pAbbr ] of Object.entries(properties)) {
  for (const [ sFull, sAbbr ] of Object.entries(sides)) {
    for (const size of sizes) {
      if (size === 'Auto' && pAbbr === 'p') continue;
      classes[`${pFull}${sFull}${size}`] = styles[`${pAbbr}${sAbbr}-${size.toLowerCase()}`];
      for (const [ bFull, bAbbr ] of Object.entries(breaks)) {
        classes[`${pFull}${sFull}${bFull}${size}`] = styles[`${pAbbr}${sAbbr}-${bAbbr}-${size.toLowerCase()}`];
        if (size !== 'auto') {
          classes[`${pFull}${sFull}${bFull}Neg${size}`] = styles[`${pAbbr}${sAbbr}-${bAbbr}-n${size.toLowerCase()}`];
        }
      }
    }
  }
}

Object.assign(className, classes);
