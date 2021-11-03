
export { default as Row } from './Row';
export { default as Column } from './Column';
export { default as Container } from './Container';
export { default as column } from './col';
export { default as spacing } from './spacing';

import Row from './Row';
import Column from './Column';
import Container from './Container';
import Grid from './Grid';

Grid.Container = Container;
Grid.Row = Row;
Grid.Column = Column;

export default Grid;
