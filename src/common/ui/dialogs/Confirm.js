import PropTypes from 'prop-types';
import { cl as classNames } from 'common/utils';
import * as styles from './dialogs.scss';
import Dialog from './Dialog';


export default function ConfirmDialog ({
  caption,
  dialogClassName,
  submitCaption = 'Continue',
  ...props
}) {
  return (
    <Dialog
      {...props}
      submitCaption={submitCaption}
      dialogClassName={classNames(dialogClassName, styles.confirm)}
    >
      {caption}
    </Dialog>
  );
}
ConfirmDialog.propTypes = {
  ...Dialog.propTypes,
  caption: PropTypes.string.isRequired,
};
