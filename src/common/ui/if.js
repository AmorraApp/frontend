
import { all, any } from 'common/utils';

export default function If ({ any: indefAny, children, ...props }) {
  const op = indefAny ? any : all;
  const yes = op(Object.values(props));
  return yes ? children : null;
}
