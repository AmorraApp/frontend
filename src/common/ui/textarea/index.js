import PropTypes from 'common/prop-types';
import { forwardRef, useEffect, useRef } from 'react';
import TextField from 'common/ui/textfield';
import useMergedRefs from 'common/hooks/useMergedRefs';

const propTypes = {
  /**
     * Input size variants
     *
     * @type {('sm'|'lg')}
     */
  size: PropTypes.string,

  /**
     * The underlying HTML element to use when rendering the Input.
     *
     * @type {('input'|'textarea'|'select'|elementType)}
     */
  as: PropTypes.elementType,

  /** Make the control readonly */
  readOnly: PropTypes.bool,

  /** Make the control disabled */
  disabled: PropTypes.bool,

  /**
     * The `value` attribute of underlying input
     *
     * @controllable onChange
     * */
  value: PropTypes.string,

  /** A callback fired when the `value` prop changes */
  onChange: PropTypes.func,

  onKeyDown: PropTypes.func,
  onEnterKey: PropTypes.func,

  /**
     * The HTML input `type`, which is only relevant if `as` is `'input'` (the default).
     */
  type: PropTypes.string,

  /**
     * Uses `controlId` from InputContext if not explicitly specified.
     */
  id: PropTypes.string,

  /** Add "valid" validation styles to the control */
  isValid: PropTypes.bool,

  /** Add "invalid" validation styles to the control and accompanying label */
  isInvalid: PropTypes.bool,

  focusKey: PropTypes.any,

  /** Number of rows of text visible by default */
  rows: PropTypes.number,

  /** Make the control grow in height as more rows are added */
  grow: PropTypes.bool,
};

const TextArea = forwardRef(function TextArea ({
  rows = 0,
  grow,
  ...props
}, ref) {

  const textareaRef = useRef();
  ref = useMergedRefs(ref, textareaRef);

  useEffect(() => {
    if (!grow) return;
    resize(rows, textareaRef.current);
  }, [ ref, rows ]);

  return (
    <TextField as="textarea" ref={ref} {...props} />
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
