import { cl as classNames } from 'common/utils';
import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import useInputContext from 'common/ui/useInputContext';
import styles from './input.scss';

const propTypes = {
  /**
     * The underlying HTML element to use when rendering the FormFileInput.
     *
     * @type {('input'|elementType)}
     */
  as: PropTypes.elementType,
  /** A HTML id attribute, necessary for proper form accessibility. */
  id: PropTypes.string,
  /** Manually style the input as valid */
  isValid: PropTypes.bool,
  /** Manually style the input as invalid */
  isInvalid: PropTypes.bool,
  /** The language for the button when using custom file input and SCSS based strings */
  lang: PropTypes.string,
};

const FormFileInput = forwardRef(({
  id,
  className,
  isValid,
  isInvalid,
  lang,
  as: Component = 'input',
  ...props
}, ref) => {
  const { controlId, custom } = useInputContext();
  const type = 'file';

  const prefix = custom
    ? 'custom-file-input'
    : 'form-control-file'
  ;

  return (
    <Component
      {...props}
      ref={ref}
      id={id || controlId}
      type={type}
      lang={lang}
      className={classNames(
        className,
        styles[prefix],
        isValid && styles['is-valid'],
        isInvalid && styles['is-invalid'],
      )}
    />
  );
});
FormFileInput.displayName = 'FormFileInput';
FormFileInput.propTypes = propTypes;
export default FormFileInput;
