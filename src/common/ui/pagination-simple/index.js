
import PropTypes from 'prop-types';
import { noop, clamp } from 'common/utils';
import { forwardRef, useRef, useCallback } from 'react';
import Pagination from 'common/ui/pagination';
import useToggledState from 'common/hooks/useToggledState';
import useDerivedState from 'common/hooks/useDerivedState';
import useGettableState from 'common/hooks/useGettableState';

import Popover from 'common/ui/popover';
import { Numeric } from 'common/ui/input';
import Overlay from 'common/ui/overlay';

const propTypes = {
  /**
   * Set's the size of all PageItems.
   *
   * @type {('sm'|'lg')}
   */
  size: PropTypes.string,

  /**
   * Function to invoke when pagination changes
   * @type {[type]}
   */
  onChange: PropTypes.func,
  start: PropTypes.number.isRequired,
  length: PropTypes.number.isRequired,
  count: PropTypes.number.isRequired,
};

const SimplePagination = forwardRef(({
  onChange = noop,
  start: oStart,
  length: oLength,
  count,
  ...props
}, ref) => {

  const [ state, setState, getState ] = useDerivedState({ start: oLength ? oStart : 0, length: oLength }, [ oStart, oLength ]);
  const {
    state: menuVisible,
    toggle: toggleMenu,
    off: hideMenu,
  } = useToggledState();
  const [ inputValue, setInputValue, getInputValue ] = useGettableState(null);
  const maxStart = Math.max(0, count - state.length);

  const onLeft = useCallback(() => {
    const { start, length } = getState();
    const newStart = Math.max(0, start - length);
    setState({ start: newStart, length });
    onChange(newStart, length);
  }, [ setState, getState, onChange ]);

  const onFullLeft = useCallback(() => {
    const { length } = getState();
    setState({ start: 0, length });
    onChange(0, length);
  }, [ setState, getState, onChange ]);

  const onFullRight = useCallback(() => {
    const { length } = getState();
    const newStart = Math.max(0, count - length);
    setState({ start: newStart, length });
    onChange(newStart, length);
  }, [ setState, getState, onChange ]);

  const onRight = useCallback(() => {
    const { start, length } = getState();
    const newStart = Math.min(start + length, count - length);
    setState({ start: newStart, length });
    onChange(newStart, length);
  }, [ setState, getState, onChange ]);

  const onLengthChange = useCallback((length) => {
    hideMenu();
    const { start } = getState();
    setState({ start: length ? start : 0, length }); // if length is 0, reset start to 0
    onChange(start, length);
  }, [ setState, getState, onChange ]);

  const onJumpKey = useCallback((ev) => {
    if (ev.key !== "Enter") return;
    const { length } = getState();
    const start = clamp(getInputValue() - 1, 0, maxStart);
    setState({ start, length });
    onChange(start, length);
    setInputValue(null);
    hideMenu();
  }, [ setState, getState, onChange ]);



  const captionEnd = state.length === 0 ? count : clamp(state.start + state.length, state.length, count);
  const caption = count
    ? `${state.start + 1} - ${captionEnd} of ${count}`
    : 'No Results'
  ;
  const menuRef = useRef(null);

  return (
    <>
      <Pagination {...props} ref={ref}>
        <Pagination.First disabled={state.start === 0} onClick={onFullLeft} />
        <Pagination.Prev disabled={state.start === 0} onClick={onLeft} />
        <Pagination.Item disabled={!count} ref={menuRef} onClick={toggleMenu}>&nbsp;{caption}&nbsp;</Pagination.Item>
        <Pagination.Next disabled={!count || state.length === 0 || state.start >= maxStart} onClick={onRight} />
        <Pagination.Last disabled={!count || state.length === 0 || state.start >= maxStart} onClick={onFullRight} />
      </Pagination>
      <Overlay target={menuRef} placement="top" flip show={menuVisible}>
        <Popover>
          <Popover.Menu>
            <MenuItem value={10}  disabled={state.length === 10}  onChange={onLengthChange} />
            <MenuItem value={25}  disabled={state.length === 25}  onChange={onLengthChange} />
            <MenuItem value={50}  disabled={state.length === 50}  onChange={onLengthChange} />
            <MenuItem value={100} disabled={state.length === 100} onChange={onLengthChange} />
            <MenuItem value={200} disabled={state.length === 200} onChange={onLengthChange} />
            <MenuItem value={0}   disabled={state.length === 0}   onChange={onLengthChange} label="All" />
            <Popover.Divider />
            <Popover.Item inactive>
              <Numeric
                placeholder="Go To..."
                step={state.length}
                min={1}
                max={maxStart}
                onKeyUp={onJumpKey}
                style={{ minHeight: 'unset' }}
                value={inputValue}
                defaultValue={state.start + 1}
                onChange={setInputValue}
              />
            </Popover.Item>
          </Popover.Menu>
        </Popover>
      </Overlay>
    </>
  );
});
SimplePagination.propTypes = propTypes;
export default SimplePagination;

function MenuItem ({ value, label, onChange, ...props }) {
  return <Popover.Item onClick={useCallback(() => onChange(value), [ value, onChange ])} {...props}>Show {value || label} Results</Popover.Item>;
}
MenuItem.propTypes = {
  value: PropTypes.number,
  label: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};
