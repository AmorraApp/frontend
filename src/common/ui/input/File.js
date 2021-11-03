import { cl as classNames } from 'common/utils';
import PropTypes from 'common/prop-types';
import { forwardRef } from 'react';
import Feedback from './Feedback';
import FormFileInput from './FileInput';
import FormFileLabel from './FileLabel';
import { InputContextProvider } from './useInputContext';
import * as styles from './input.scss';

const propTypes = {

  /**
     * The wrapping HTML element to use when rendering the FormFile.
     *
     * @type {('div'|elementType)}
     */
  as: PropTypes.elementType,
  /**
     * The underlying HTML element to use when rendering the FormFile.
     *
     * @type {('input'|elementType)}
     */
  inputAs: PropTypes.elementType,
  /** A HTML id attribute, necessary for proper form accessibility. */
  id: PropTypes.string,
  /**
     * Provide a function child to manually handle the layout of the FormFile's inner components.
     *
     * If not using the custom prop <code>FormFile.Label></code> should be before <code><FormFile.Input isInvalid /></code>
     * ```jsx
     * <FormFile>
     *   <FormFile.Label>Allow us to contact you?</FormFile.Label>
     *   <FormFile.Input isInvalid />
     *   <Feedback type="invalid">Yo this is required</Feedback>
     * </FormFile>
     * ```
     *
     * If using the custom prop <code><FormFile.Input isInvalid /></code> should be before <code>FormFile.Label></code>
     * ```jsx
     * <FormFile custom>
     *   <FormFile.Input isInvalid />
     *   <FormFile.Label>Allow us to contact you?</FormFile.Label>
     *   <Feedback type="invalid">Yo this is required</Feedback>
     * </FormFile>
     * ```
     */
  children: PropTypes.node,
  disabled: PropTypes.bool,
  label: PropTypes.node,
  /** Use Bootstrap's custom form elements to replace the browser defaults */
  custom: PropTypes.bool,
  /** Input size variants */
  size: PropTypes.string,
  /** Manually style the input as valid */
  isValid: PropTypes.bool,
  /** Manually style the input as invalid */
  isInvalid: PropTypes.bool,
  /** Display feedback as a tooltip. */
  feedbackTooltip: PropTypes.bool,
  /** A message to display when the input is in a validation state */
  feedback: PropTypes.node,
  /**
     * The string for the "Browse" text label when using custom file input
     *
     * @type string
     */
  'data-browse': PropTypes.all(PropTypes.string, ({ custom, 'data-browse': dataBrowse }) => (dataBrowse && !custom
    ? Error('`data-browse` attribute value will only be used when custom is `true`')
    : null)),
  /** The language for the button when using custom file input and SCSS based strings */
  lang: PropTypes.all(PropTypes.string, ({ custom, lang }) => (lang && !custom
    ? Error('`lang` can only be set when custom is `true`')
    : null)),
};

const FormFile = forwardRef(({
  id,
  disabled = false,
  isValid = false,
  isInvalid = false,
  feedbackTooltip = false,
  size,
  feedback,
  className,
  style,
  label,
  children,
  custom,
  lang,
  'data-browse': dataBrowse,
  as: Component = 'div',
  inputAs = 'input',
  ...props
}, ref) => {
  const prefix = custom
    ? 'custom'
    : 'form-file'
  ;

  const type = 'file';

  const hasLabel = !!label && !children;

  const input = (
    <FormFileInput {...props} ref={ref} isValid={isValid} isInvalid={isInvalid} disabled={disabled} as={inputAs} lang={lang} />
  );
  return (
    <InputContextProvider
      controlId={id}
      custom={custom}
      as={Component}
      {...{
        style,
        className: classNames(
          className,
          styles[prefix],
          custom && styles[`custom-${type}`],
          size && styles[`${prefix}-${size}`],
        ),
      }}
    >
      {children || (<>
        {custom ? (<>
          {input}
          {hasLabel && (<FormFileLabel data-browse={dataBrowse}>
            {label}
          </FormFileLabel>)}
        </>) : (<>
          {hasLabel && <FormFileLabel>{label}</FormFileLabel>}
          {input}
        </>)}
        {(isValid || isInvalid) && (<Feedback type={isValid ? 'valid' : 'invalid'} tooltip={feedbackTooltip}>
          {feedback}
        </Feedback>)}
      </>)}
    </InputContextProvider>
  );
});
FormFile.displayName = 'FormFile';
FormFile.propTypes = propTypes;
FormFile.Input = FormFileInput;
FormFile.Label = FormFileLabel;
export default FormFile;
