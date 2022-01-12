
// import Grid from 'common/ui/grid';
import Pagination from 'common/ui/pagination';
import PaginationSimple from 'common/ui/pagination-simple';
import At from 'common/svgs/solid/at.svg';

import { Monospace } from 'common/ui/text';


export default function Selects () {
  return (
    <div>
      <h2>Pagination <Monospace variant="small">common/ui/pagination</Monospace></h2>

      <Pagination>
        <Pagination.First />
        <Pagination.Prev />
        <Pagination.Item>Default Item</Pagination.Item>
        <Pagination.Item active>Active Item</Pagination.Item>
        <Pagination.Item inactive>Inactive Item</Pagination.Item>
        <Pagination.Item disabled>Disabled Item</Pagination.Item>
        <Pagination.Item><At /></Pagination.Item>
        <Pagination.Ellipsis />
        <Pagination.Next />
        <Pagination.Last />
      </Pagination>

      <hr />
      <h2>Easy Pagination <Monospace variant="small">common/ui/pagination-simple</Monospace></h2>

      <PaginationSimple start={0} length={100} count={1024} />

    </div>
  );
}
