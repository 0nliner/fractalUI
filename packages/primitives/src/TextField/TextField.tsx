import {
  TextField as AriaTextField,
  Label,
  Input,
  Text,
  FieldError,
  type TextFieldProps as AriaTextFieldProps,
} from 'react-aria-components';
import * as s from './TextField.css';

export type TextFieldProps = Omit<AriaTextFieldProps, 'className' | 'children'> & {
  label?: string;
  description?: string;
  placeholder?: string;
  errorMessage?: string;
};

/** Текстовое поле на React Aria: label + input + описание/ошибка, стили на токенах. */
export function TextField({ label, description, placeholder, errorMessage, ...props }: TextFieldProps) {
  return (
    <AriaTextField {...props} className={s.field}>
      {label ? <Label className={s.label}>{label}</Label> : null}
      <Input className={s.input} placeholder={placeholder} />
      {description ? (
        <Text slot="description" className={s.description}>
          {description}
        </Text>
      ) : null}
      <FieldError className={s.errorText}>{errorMessage}</FieldError>
    </AriaTextField>
  );
}
