import { useForm, type DefaultValues } from 'react-hook-form';
import { ajvResolver } from '@hookform/resolvers/ajv';
import type { JSONSchemaType } from 'ajv';
import { Button } from '@fractalui/primitives';
import { AutoField } from './fields';
import * as s from './AutoForm.css';
import type { AutoFormProps, AutoFormValues } from './types';

/**
 * Генерация формы из JSON-схемы на React Hook Form + AJV (валидация из схемы).
 * Замена легаси RJSF. Данные наружу — через onSubmit, без сети/стора.
 */
export function AutoForm({ schema, defaultValues, onSubmit, submitLabel = 'Отправить' }: AutoFormProps) {
  const required = schema.required ?? [];
  const { control, handleSubmit } = useForm<AutoFormValues>({
    resolver: ajvResolver(schema as unknown as JSONSchemaType<AutoFormValues>, {
      strict: false,
      allErrors: true,
    }),
    defaultValues: defaultValues as DefaultValues<AutoFormValues> | undefined,
  });

  return (
    <form className={s.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      {schema.title ? <h3 className={s.title}>{schema.title}</h3> : null}
      {Object.entries(schema.properties).map(([name, field]) => (
        <AutoField key={name} name={name} field={field} control={control} required={required.includes(name)} />
      ))}
      <div className={s.actions}>
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}
