import { Controller, type Control } from 'react-hook-form';
import {
  ComboBox,
  DatePicker,
  Dropzone,
  NumberField,
  Radio,
  RadioGroup,
  Select,
  Switch,
  TextArea,
  TextField,
} from '@fractalui/primitives';
import type { AutoFormValues, FieldSchema } from './types';

type AutoFieldProps = {
  name: string;
  field: FieldSchema;
  control: Control<AutoFormValues>;
  required: boolean;
};

/** Что рисовать: явный `x-widget` важнее, иначе выводим из типа схемы. */
function resolveWidget(field: FieldSchema) {
  if (field['x-widget']) return field['x-widget'];
  if (field.type === 'boolean') return 'switch' as const;
  if (field.type === 'array') return 'tags' as const;
  if (field.enum) return 'select' as const;
  if (field.type === 'number' || field.type === 'integer') return 'number' as const;
  return 'text' as const;
}

function optionsOf(field: FieldSchema) {
  return (field.enum ?? []).map((value) => ({
    id: value,
    label: field.enumLabels?.[value] ?? value,
  }));
}

/**
 * Маппинг «схема поля → контрол» через RHF Controller + примитивы fractalUI.
 *
 * Раньше здесь было три ветки, и `enum` рендерился сырым `<select>` — без
 * токенов и с нативным видом, разным в каждой ОС. Теперь любой контрол берётся
 * из кита, а неоднозначные случаи разруливает `x-widget`.
 */
export function AutoField({ name, field, control, required }: AutoFieldProps) {
  const label = `${field.title ?? name}${required ? ' *' : ''}`;
  const widget = resolveWidget(field);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: f, fieldState }) => {
        const error = fieldState.error?.message;
        const common = {
          label,
          description: field.description,
          isInvalid: Boolean(error),
          errorMessage: error,
        };

        switch (widget) {
          case 'switch':
            return (
              <Switch isSelected={Boolean(f.value)} onChange={f.onChange}>
                {label}
              </Switch>
            );

          case 'select':
            return (
              <Select
                {...common}
                options={optionsOf(field)}
                placeholder={field.placeholder}
                selectedKey={(f.value as string | undefined) ?? null}
                onSelectionChange={(key) => f.onChange(key)}
                onBlur={f.onBlur}
              />
            );

          case 'radio':
            return (
              <RadioGroup
                {...common}
                value={(f.value as string | undefined) ?? null}
                onChange={f.onChange}
              >
                {optionsOf(field).map((o) => (
                  <Radio key={String(o.id)} value={String(o.id)}>
                    {o.label}
                  </Radio>
                ))}
              </RadioGroup>
            );

          case 'textarea':
            return (
              <TextArea
                {...common}
                placeholder={field.placeholder}
                value={(f.value as string | undefined) ?? ''}
                onChange={f.onChange}
                onBlur={f.onBlur}
              />
            );

          case 'number':
            return (
              <NumberField
                {...common}
                minValue={field.minimum}
                maxValue={field.maximum}
                value={f.value == null ? Number.NaN : Number(f.value)}
                onChange={(v) => f.onChange(Number.isNaN(v) ? undefined : v)}
                onBlur={f.onBlur}
              />
            );

          case 'date':
            return (
              <DatePicker
                {...common}
                value={(f.value as string | undefined) ?? null}
                onChange={f.onChange}
              />
            );

          case 'file':
            return (
              <Dropzone
                label={label}
                hint={field.description}
                acceptedFileTypes={field['x-accept']}
                onFiles={(files) => f.onChange(files)}
              />
            );

          // Массив строк: свободный ввод тегов либо выбор из enum.
          case 'tags': {
            const selected = Array.isArray(f.value) ? (f.value as string[]) : [];
            return (
              <ComboBox
                {...common}
                placeholder={field.placeholder}
                options={(field.items?.enum ?? []).map((v) => ({ id: v, label: v }))}
                allowsCustomValue
                inputValue={selected.join(', ')}
                onInputChange={(v) =>
                  f.onChange(
                    v
                      .split(',')
                      .map((part) => part.trim())
                      .filter(Boolean),
                  )
                }
                onBlur={f.onBlur}
              />
            );
          }

          default:
            return (
              <TextField
                {...common}
                // Без type='password' пароль виден при вводе, а браузер
                // не предлагает сохранить его и не подставляет из менеджера.
                // Схема сама этого не знает: и пароль, и имя — просто string.
                type={widget === 'password' ? 'password' : widget === 'email' ? 'email' : 'text'}
                placeholder={field.placeholder}
                value={f.value == null ? '' : String(f.value)}
                onChange={f.onChange}
                onBlur={f.onBlur}
              />
            );
        }
      }}
    />
  );
}
