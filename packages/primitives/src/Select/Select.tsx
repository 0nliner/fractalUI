import {
  Select as AriaSelect,
  Label,
  Button,
  SelectValue,
  Popover,
  ListBox,
  ListBoxItem,
  Text,
  FieldError,
  type SelectProps as AriaSelectProps,
  type Key,
} from 'react-aria-components';
import * as f from '../field/field.css';
import * as s from './Select.css';

export type SelectOption = {
  id: Key;
  label: string;
  description?: string;
  isDisabled?: boolean;
};

export type SelectProps = Omit<
  AriaSelectProps<SelectOption>,
  'className' | 'children' | 'items'
> & {
  label?: string;
  description?: string;
  errorMessage?: string;
  placeholder?: string;
  options: SelectOption[];
};

/**
 * Выпадающий список.
 *
 * Самая заметная дыра кита до этого: `AutoForm` для `enum` рендерил сырой
 * `<select>` — без токенов, без общей геометрии полей и с нативным видом,
 * разным в каждой ОС. Фильтры каталога, сортировка и выбор категории тоже
 * упирались в это.
 *
 * Список рендерится в `Popover`, то есть порталом в `body`. Именно поэтому
 * класс темы обязан висеть на `<html>`, а не на корне приложения — иначе
 * переменные сюда не дойдут.
 */
export function Select({
  label,
  description,
  errorMessage,
  placeholder = 'Выберите…',
  options,
  ...props
}: SelectProps) {
  return (
    <AriaSelect {...props} className={f.root}>
      {label ? <Label className={f.label}>{label}</Label> : null}
      <Button className={f.control}>
        <SelectValue className={s.value}>
          {({ isPlaceholder, selectedText }) =>
            isPlaceholder ? <span className={s.placeholder}>{placeholder}</span> : selectedText
          }
        </SelectValue>
        <span aria-hidden className={s.chevron}>
          ▾
        </span>
      </Button>
      {description ? (
        <Text slot="description" className={f.description}>
          {description}
        </Text>
      ) : null}
      <FieldError className={f.errorText}>{errorMessage}</FieldError>
      <Popover className={f.popover}>
        <ListBox items={options} className={s.list}>
          {(item) => (
            <ListBoxItem
              id={item.id}
              textValue={item.label}
              isDisabled={item.isDisabled}
              className={f.option}
            >
              <span className={s.optionBody}>
                <span>{item.label}</span>
                {item.description ? (
                  <span className={s.optionDescription}>{item.description}</span>
                ) : null}
              </span>
            </ListBoxItem>
          )}
        </ListBox>
      </Popover>
    </AriaSelect>
  );
}
