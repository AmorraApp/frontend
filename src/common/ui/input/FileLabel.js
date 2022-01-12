import { cl as classNames } from 'common/utils';
import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import useInputContext from 'common/ui/useInputContext';
import styles from './input.scss';

const propTypes = {
  /** The HTML for attribute for associating the label with an input */
  htmlFor: PropTypes.string,
  /** The string for the "Browse" text label when using custom file input */
  'data-browse': PropTypes.string,
};

const FormFileLabel = forwardRef(({
  className,
  htmlFor,
  ...props
}, ref) => {
  const { controlId, custom } = useInputContext();

  const prefix = custom
    ? 'custom-file-label'
    : 'form-file-label'
  ;

  return (
    <label
      {...props}
      ref={ref}
      htmlFor={htmlFor || controlId}
      className={classNames(className, styles[prefix])}
      data-browse={props['data-browse']}
    />
  );
});
FormFileLabel.displayName = 'FormFileLabel';
FormFileLabel.propTypes = propTypes;
export default FormFileLabel;
