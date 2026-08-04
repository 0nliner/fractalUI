import { Controller, type Control } from 'react-hook-form';
import { TextField, Switch } from '@fractalui/primitives';
import * as s from './AutoForm.css';
import type { AutoFormValues, FieldSchema } from './types';

type AutoFieldProps = {
  name: string;
  field: FieldSchema;
  control: Control<AutoFormValues>;
  required: boolean;
};

/** Маппинг «схема поля → контрол» через RHF Controller + примитивы fractalUI. */
export function AutoField({ name, field, control, required }: AutoFieldProps) {
  const label = `${field.title ?? name}${required ? ' *' : ''}`;

  if (field.type === 'boolean') {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field: f }) => (
          <Switch isSelected={Boolean(f.value)} onChange={f.onChange}>
            {label}
          </Switch>
        )}
      />
    );
  }

  if (field.enum) {
    const options = field.enum;
    return (
      <Controller
        name={name}
        control={control}
        render={({ field: f, fieldState }) => (
          <label className={s.field}>
            <span className={s.label}>{label}</span>
            <select
              className={s.select}
              value={(f.value as string | undefined) ?? ''}
              onChange={(e) => f.onChange(e.target.value)}
              onBlur={f.onBlur}
            >
              <option value="" disabled>
                —
              </option>
              {options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            {fieldState.error ? <span className={s.error}>{fieldState.error.message}</span> : null}
          </label>
        )}
      />
    );
  }

  const isNumber = field.type === 'number' || field.type === 'integer';
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: f, fieldState }) => (
        <TextField
          label={label}
          description={field.description}
          value={f.value == null ? '' : String(f.value)}
          onChange={(v) => f.onChange(isNumber ? (v === '' ? undefined : Number(v)) : v)}
          isInvalid={Boolean(fieldState.error)}
          errorMessage={fieldState.error?.message}
        />
      )}
    />
  );
}
