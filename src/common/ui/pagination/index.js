
export { default as PageItem, Ellipsis, First, Last, Next, Prev } from './PageItem';
export { default as Classes } from './pagination.scss';

import Pagination from './Pagination';
import PageItem, { Ellipsis, First, Last, Next, Prev } from './PageItem';

Pagination.First = First;
Pagination.Prev = Prev;
Pagination.Ellipsis = Ellipsis;
Pagination.Item = PageItem;
Pagination.Next = Next;
Pagination.Last = Last;
export default Pagination;
