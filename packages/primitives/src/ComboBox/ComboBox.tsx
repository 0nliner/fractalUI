import {
  ComboBox as AriaComboBox,
  Label,
  Group,
  Input,
  Button,
  Popover,
  ListBox,
  ListBoxItem,
  Text,
  FieldError,
  type ComboBoxProps as AriaComboBoxProps,
  type Key,
} from 'react-aria-components';
import * as f from '../field/field.css';
import * as s from './ComboBox.css';

export type ComboBoxOption = {
  id: Key;
  label: string;
  isDisabled?: boolean;
};

export type ComboBoxProps = Omit<
  AriaComboBoxProps<ComboBoxOption>,
  'className' | 'children' | 'items'
> & {
  label?: string;
  description?: string;
  errorMessage?: string;
  placeholder?: string;
  options: ComboBoxOption[];
  /** Сообщение, когда фильтр не дал совпадений. */
  emptyMessage?: string;
};

/**
 * Список с поиском по вводу.
 *
 * Нужен там, где вариантов слишком много для `Select`: теги, города, категории.
 * С `allowsCustomValue` годится и для ввода нового значения — например тега,
 * которого ещё нет.
 *
 * Фильтрацию RAC не делает сам: список приходит уже отфильтрованным через
 * `options`, а ввод отдаётся наружу через `onInputChange`. Так поиск может быть
 * и серверным, и локальным — решает потребитель, а L1 остаётся без сети.
 */
export function ComboBox({
  label,
  description,
  errorMessage,
  placeholder,
  options,
  emptyMessage = 'Ничего не найдено',
  ...props
}: ComboBoxProps) {
  return (
    <AriaComboBox {...props} className={f.root}>
      {label ? <Label className={f.label}>{label}</Label> : null}
      <Group className={f.control}>
        <Input className={f.bareInput} placeholder={placeholder} />
        <Button className={s.trigger} aria-label="Показать варианты">
          ▾
        </Button>
      </Group>
      {description ? (
        <Text slot="description" className={f.description}>
          {description}
        </Text>
      ) : null}
      <FieldError className={f.errorText}>{errorMessage}</FieldError>
      <Popover className={f.popover}>
        <ListBox items={options} className={s.list} renderEmptyState={() => (
          <div className={s.empty}>{emptyMessage}</div>
        )}>
          {(item) => (
            <ListBoxItem
              id={item.id}
              textValue={item.label}
              isDisabled={item.isDisabled}
              className={f.option}
            >
              {item.label}
            </ListBoxItem>
          )}
        </ListBox>
      </Popover>
    </AriaComboBox>
  );
}
