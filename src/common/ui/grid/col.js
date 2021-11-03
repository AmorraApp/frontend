
import { isObject } from 'common/utils';
import * as styles from './col.scss';

export default function className (column = 1, size = 'sm', type = 'col') {
  if (isObject(column)) {
    column = { column: 1, size: 'sm', type: 'col', ...column };
    size = column.size;
    column = column.column;
  }
  const selector = `${type}-${size}-${column}`;
  return styles[selector];
}

const classes = { ...styles };
const breaks = { Small: 'sm', Medium: 'md', Large: 'lg', XLarge: 'xl' };
const sizes = [ '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', 'Auto' ];

for (const size of sizes) {
  classes['column' + size] = styles[`col-${size.toLowerCase()}`];
  for (const [ bFull, bAbbr ] of Object.entries(breaks)) {
    classes['column' + bFull + size] = styles[`col-${bAbbr}-${size.toLowerCase()}`];
  }
}
Object.assign(className, classes);

