import PropTypes from 'prop-types';
import { forwardRef, useCallback, useRef, Children, isValidElement } from 'react';
import useMergedRefs from 'common/hooks/useMergedRefs';
import { deepEqual, isNumber, isFunction, sum } from 'common/utils';
import useComponentPosition from 'common/hooks/useComponentPosition';
import useGettableState from 'common/hooks/useGettableState';
import useUpdatedRef from 'common/hooks/useUpdatedRef';
import useSmartEffect from 'common/hooks/useSmartEffect';
import { useDebounce } from 'common/hooks/useTimers';

const List = forwardRef(({
  items = [],
  itemHeight,
  children,
  buffer = 3,
  style = {},
  onScroll,
  onVisibleChange,
  rowRender,
  ...props
}, ref) => {
  const itemsRef = useUpdatedRef(items || []);
  const outerRef = useRef();
  ref = useMergedRefs(ref, outerRef);

  const headerRef = useRef();

  const [ visibility, setVisibility, getVisibility ] = useGettableState({
    before: {
      first: 0,
      last: 0,
      length: 0,
      height: 0,
    },
    visible: {
      first: 0,
      last: 0,
      realFirst: 0,
      realLast: 0,
      realLength: 0,
      length: 0,
      height: 0,
    },
    after: {
      first: 0,
      last: 0,
      length: 0,
      height: 0,
    },
  });
  const handleScrollChange = useCallback((ev) => {
    const vis = scanVisibility({
      element: outerRef.current,
      header: headerRef.current,
      items: itemsRef.current,
      itemHeight,
      buffer,
    });
    if (!deepEqual(getVisibility(), vis)) {
      setVisibility(vis);
      onVisibleChange && onVisibleChange({
        first: vis.visible.realFirst,
        last: vis.visible.realLast,
        length: vis.visible.realLength,
        items: itemsRef.current.slice(vis.visible.realFirst, vis.visible.realLast),

        bufferedFirst: vis.visible.first,
        bufferedLast: vis.visible.last,
        bufferedLength: vis.visible.length,
        bufferedItems: itemsRef.current.slice(vis.visible.first, vis.visible.last),
      });
    }
    ev && onScroll && onScroll(ev);
  }, []);

  useComponentPosition(outerRef,  handleScrollChange);
  useComponentPosition(headerRef, handleScrollChange);

  const debouncedUpdate = useDebounce(handleScrollChange, 200, 1000);
  useSmartEffect(debouncedUpdate, items);

  let header, footer;
  for (const child of Children.toArray(children)) {
    if (isFunction(child)) {
      rowRender = child;
      continue;
    }

    if (!isValidElement(child)) continue;
    if (child.type === Header) {
      header = child;
      continue;
    }
    if (child.type === Footer) {
      footer = child;
      continue;
    }
    if (child.type === Row && isFunction(child.props.children)) {
      rowRender = child.props.children;
      if (child.props.height) itemHeight = child.props.height;
      continue;
    }
  }

  const { ignore: ignoreHeader, ...headerProps } = header?.props || {};

  style = {
    ...style,
    overflowY: 'scroll',
    overflowX: 'hidden',
  };

  const { first, last } = visibility.visible;

  return (
    <div ref={ref} {...props} style={style} onScroll={handleScrollChange}>
      <div {...headerProps} ref={ignoreHeader ? undefined : headerRef} />
      <div style={{ height: visibility.before.height }} />
      {items.slice(first, last + 1).map((item, i) => rowRender(item, first + i))}
      <div style={{ height: visibility.after.height }} />
      <div {...footer?.props} />
    </div>
  );
});
List.displayName = 'VirtualList';
List.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any),
  itemHeight: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.func,
  ]).isRequired,
  buffer: PropTypes.number,
  onScroll: PropTypes.func,
  onVisibleChange: PropTypes.func,
  rowRender: PropTypes.func,
};

function abstract (name, propTypes) {
  const C = () => { throw new Error(`The ${name} component should not be used outside of the VirtualList context.`); };
  C.displayName = name;
  C.propTypes = propTypes;
  return C;
}

export var Header = List.Header = abstract('Header');
export var Footer = List.Footer = abstract('Footer');

export var Row    = List.Row    = abstract('Row', {
  height: PropTypes.number,
});

export default List;

function scanVisibility ({ element = {}, header = {}, items, itemHeight, buffer }) {
  const { offsetHeight: headerHeight = 0 } = header;
  // const { offsetHeight: footerHeight = 0 } = footer;
  const { offsetHeight = 0, scrollTop = 0 } = element;
  const available = items.length;
  const lastIndex = Math.max(0, available - 1);

  if (isNumber(itemHeight)) {
    const firstVisible = Math.floor(Math.max(0, scrollTop - headerHeight) / itemHeight);
    const totalVisible = Math.ceil(offsetHeight / itemHeight);

    const unbufferedFirstVisible = Math.max(0, Math.min(available, firstVisible));
    const realFirstVisible = Math.max(0, Math.min(available, firstVisible - buffer));
    const unbufferedLastVisible = Math.min(lastIndex, firstVisible + totalVisible);
    const realLastVisible = Math.min(lastIndex, firstVisible + totalVisible + buffer);
    const remaining = Math.max(lastIndex - realLastVisible, 0);

    return {
      before: {
        first: 0,
        last: realFirstVisible - 1,
        length: Math.min(realFirstVisible + 1, available),
        height: Math.min(realFirstVisible, available) * itemHeight,
      },
      visible: {
        first: realFirstVisible,
        last: realLastVisible,
        realFirst: unbufferedFirstVisible,
        realLast: unbufferedLastVisible,
        realLength: Math.min(unbufferedLastVisible - unbufferedFirstVisible + 1, available),
        length: Math.min(realLastVisible - realFirstVisible + 1, available),
        height: (realLastVisible - realLastVisible + 1) * itemHeight,
      },
      after: {
        first: Math.min(lastIndex, realLastVisible + 1),
        last: lastIndex,
        length: remaining,
        height: remaining * itemHeight,
      },
    };
  }

  if (isFunction(itemHeight)) {
    let above = 0;
    let aboveHeight = 0;
    let view = 0;
    let viewHeight = 0;
    let below = 0;
    let belowHeight = 0;
    let y = headerHeight;
    const bufferAboveStack = [];
    const bufferBelowStack = [];
    for (let i = 0; i <= lastIndex; i++) {
      const h = itemHeight(items?.[i], i);
      if (y + h < scrollTop) {
        above++;
        aboveHeight += h;
        if (buffer) {
          bufferAboveStack.push(h);
          if (bufferAboveStack.length > buffer) bufferAboveStack.shift();
        }
      } else if (y > scrollTop + offsetHeight) {
        below++;
        belowHeight += h;
        if (buffer) {
          bufferBelowStack.push(h);
          if (bufferBelowStack.length > buffer) bufferBelowStack.shift();
        }
      } else {
        view++;
        viewHeight += h;
      }
      y += h;
    }

    const unbufferedFirstVisible = Math.min(above, available);
    const unbufferedLastVisible = above + view;
    const unbufferedLength = view;
    const preBuffer = sum(bufferAboveStack);
    const postBuffer = sum(bufferBelowStack);
    above = Math.max(0, above - buffer);
    below = Math.min(0, below - buffer);
    aboveHeight = Math.max(0, aboveHeight - preBuffer);
    belowHeight = Math.max(0, belowHeight - postBuffer);
    view = Math.min(lastIndex, view + (buffer * 2));
    viewHeight += preBuffer + postBuffer;

    return {
      before: {
        first: 0,
        last: above,
        length: Math.min(above + 1, available),
        height: aboveHeight,
      },
      visible: {
        first: Math.min(above, available),
        last: above + view,
        length: view,
        height: viewHeight,
        realFirst: unbufferedFirstVisible,
        realLast: unbufferedLastVisible,
        realLength: unbufferedLength,
      },
      after: {
        first: Math.min(above + view + 1, available),
        last: lastIndex,
        length: below,
        height: belowHeight,
      },
    };
  }

  return {
    before: {
      first: 0,
      last: 0,
      length: 0,
      height: 0,
    },
    visible: {
      first: 0,
      last: 0,
      realFirst: 0,
      realLast: 0,
      realLength: 0,
      length: 0,
      height: 0,
    },
    after: {
      first: 0,
      last: 0,
      length: 0,
      height: 0,
    },
  };
}
