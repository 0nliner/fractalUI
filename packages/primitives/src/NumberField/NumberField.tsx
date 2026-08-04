import {
  NumberField as AriaNumberField,
  Label,
  Group,
  Input,
  Button,
  Text,
  FieldError,
  type NumberFieldProps as AriaNumberFieldProps,
} from 'react-aria-components';
import * as f from '../field/field.css';
import * as s from './NumberField.css';

export type NumberFieldProps = Omit<AriaNumberFieldProps, 'className' | 'children'> & {
  label?: string;
  description?: string;
  placeholder?: string;
  errorMessage?: string;
  /** Скрыть кнопки −/+ и оставить только ввод с клавиатуры. */
  hideSteppers?: boolean;
};

/**
 * Числовое поле со степперами.
 *
 * RAC берёт на себя то, из-за чего самописные счётчики обычно и ломаются:
 * удержание кнопки, ввод с клавиатуры, локальный формат числа, зажим по
 * `minValue`/`maxValue` и корректный `role="spinbutton"` для скринридера.
 */
export function NumberField({
  label,
  description,
  placeholder,
  errorMessage,
  hideSteppers = false,
  ...props
}: NumberFieldProps) {
  return (
    <AriaNumberField {...props} className={f.root}>
      {label ? <Label className={f.label}>{label}</Label> : null}
      <Group className={f.control}>
        {hideSteppers ? null : (
          <Button slot="decrement" className={s.stepper} aria-label="Уменьшить">
            −
          </Button>
        )}
        <Input className={s.input} placeholder={placeholder} />
        {hideSteppers ? null : (
          <Button slot="increment" className={s.stepper} aria-label="Увеличить">
            +
          </Button>
        )}
      </Group>
      {description ? (
        <Text slot="description" className={f.description}>
          {description}
        </Text>
      ) : null}
      <FieldError className={f.errorText}>{errorMessage}</FieldError>
    </AriaNumberField>
  );
}
