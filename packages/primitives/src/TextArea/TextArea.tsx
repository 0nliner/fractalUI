import {
  TextField as AriaTextField,
  Label,
  TextArea as AriaTextArea,
  Text,
  FieldError,
  type TextFieldProps as AriaTextFieldProps,
} from 'react-aria-components';
import * as f from '../field/field.css';
import * as s from './TextArea.css';

export type TextAreaProps = Omit<AriaTextFieldProps, 'className' | 'children'> & {
  label?: string;
  description?: string;
  placeholder?: string;
  errorMessage?: string;
  /** Высота в строках. По умолчанию 4 — хватает отзыву и описанию товара. */
  rows?: number;
};

/**
 * Многострочное поле.
 *
 * Отдельный слайс, а не проп у `TextField`: у RAC это другой элемент
 * (`<TextArea>` вместо `<Input>`), и своя геометрия — авторастяжение по
 * содержимому, фиксированная минимальная высота, вертикальный ресайз.
 */
export function TextArea({
  label,
  description,
  placeholder,
  errorMessage,
  rows = 4,
  ...props
}: TextAreaProps) {
  return (
    <AriaTextField {...props} className={f.root}>
      {label ? <Label className={f.label}>{label}</Label> : null}
      <AriaTextArea className={s.textarea} placeholder={placeholder} rows={rows} />
      {description ? (
        <Text slot="description" className={f.description}>
          {description}
        </Text>
      ) : null}
      <FieldError className={f.errorText}>{errorMessage}</FieldError>
    </AriaTextField>
  );
}
