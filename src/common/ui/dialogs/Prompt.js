import PropTypes from 'prop-types';
import { useCallback, useRef } from 'react';
import { cl as classNames } from 'common/utils';
import useDerivedState from 'common/hooks/useDerivedState';
import * as styles from './dialogs.scss';
import { Labelable, Label, TextField, TextArea, Feedback } from 'common/ui/input';
import Dialog from './Dialog';
import useTripWire from 'common/hooks/useTripWire';

function Growable (props) {
  return <TextArea style={{ resize: 'none' }} rows={1} grow {...props} />;
}

export default function PromptDialog ({
  dialogClassName,
  caption,
  value: oValue = '',
  onSubmit,
  Input,
  submitCaption = 'OK',
  invalidate = () => false,
  placeholder,
  multiline,

  ...props
}) {

  if (!Input) {
    Input = multiline ? Growable : TextField;
  }

  const [ value, setValue, getValue ] = useDerivedState(oValue, [ oValue ]);
  const dirty = useTripWire(value !== oValue);

  const submit = useCallback(() => onSubmit && onSubmit(getValue()), [ onSubmit ]);

  const inputRef = useRef();
  const focus = useCallback(() => inputRef.current?.focus());

  const invalid = invalidate(value);

  return (
    <Dialog
      {...props}
      submitCaption={submitCaption}
      dialogClassName={classNames(dialogClassName, styles.prompt)}
      onSubmit={submit}
      onEntering={focus}
    >
      <Labelable>
        <Label>{caption}</Label>
        <Input
          ref={inputRef}
          value={String(value) || ''}
          onChange={setValue}
          placeholder={placeholder}
          isValid={dirty && !invalid}
          isInvalid={dirty && !!invalid}
          onEnterKey={!multiline && submit || undefined}
        />
        {!!invalid && <Feedback type="invalid">{invalid}</Feedback>}
      </Labelable>
    </Dialog>
  );
}
PromptDialog.propTypes = {
  ...Dialog.propTypes,
  caption: PropTypes.string.isRequired,
  value: PropTypes.string,
  Input: PropTypes.elementType,
  validate: PropTypes.func,
  placeholder: PropTypes.string,
  multiline: PropTypes.bool,
};
