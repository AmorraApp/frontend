
import { forwardRef, createRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import BaseInput from './BaseInput';

const propTypes = {
  /**
   * Render the input as plain text. Generally used along side `readOnly`.
   */
  plaintext: PropTypes.bool,

  /** Make the control readonly */
  readOnly: PropTypes.bool,

  /** Make the control disabled */
  disabled: PropTypes.bool,

  /**
   * The `value` attribute of underlying input
   *
   * @controllable onChange
   * */
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),

  /** A callback fired when the `value` prop changes */
  onChange: PropTypes.func,

  /**
   * Uses `controlId` from InputContext if not explicitly specified.
   */
  id: PropTypes.string,

  /** Add "valid" validation styles to the control */
  isValid: PropTypes.bool,

  /** Add "invalid" validation styles to the control and accompanying label */
  isInvalid: PropTypes.bool,

  /** Number of rows of text visible by default */
  rows: PropTypes.number,

  /** Make the control grow in height as more rows are added */
  grow: PropTypes.bool,

};

const TextArea = forwardRef(function TextArea (props, ref) {

  const {
    rows = 0,
    grow,
    ...remain
  } = {
    type: 'text',
    ...props,
  };

  if (grow) {
    if (!ref) ref = createRef();

    useEffect(() => {
      resize(rows, ref.current);
    }, [ ref, rows ]);
  }

  return (
    <BaseInput as="textarea" ref={ref} {...remain} />
  );
});

TextArea.displayName = 'FormTextArea';
TextArea.propTypes = propTypes;

export default TextArea;

function getHeight (rows, el) {
  const {
    borderBottomWidth,
    borderTopWidth,
    fontSize,
    lineHeight,
    paddingBottom,
    paddingTop,
  } = window.getComputedStyle(el);

  const lh =
    lineHeight === 'normal'
      ? parseFloat(fontSize) * 1.2
      : parseFloat(lineHeight);

  const rowHeight =
    rows
      ? (lh * rows) +
        parseFloat(borderBottomWidth) +
        parseFloat(borderTopWidth) +
        parseFloat(paddingBottom) +
        parseFloat(paddingTop)
      : 0
    ;

  const scrollHeight =
    el.scrollHeight + parseFloat(borderBottomWidth) + parseFloat(borderTopWidth);

  return Math.max(rowHeight, scrollHeight);
}

function resize (rows, el) {
  if (!el) return;

  let overflowY = 'hidden';
  const { maxHeight } = window.getComputedStyle(el);

  if (maxHeight !== 'none') {
    const maxHeightN = parseFloat(maxHeight);

    if (maxHeightN < el.scrollHeight) {
      overflowY = '';
    }
  }

  el.style.height = '0';
  el.style.overflowY = overflowY;
  el.style.height = `${getHeight(rows, el)}px`;
}
