/** Упрощённая JSON-схема поля (подмножество, нужное для генерации формы). */
export type FieldSchema = {
  type: 'string' | 'number' | 'integer' | 'boolean';
  title?: string;
  description?: string;
  enum?: string[];
};

export type ObjectSchema = {
  type: 'object';
  title?: string;
  properties: Record<string, FieldSchema>;
  required?: string[];
};

export type AutoFormValues = Record<string, unknown>;

export type AutoFormProps = {
  /** JSON-схема объекта (в проде — из OpenAPI components.schemas). */
  schema: ObjectSchema;
  defaultValues?: AutoFormValues;
  onSubmit: (data: AutoFormValues) => void;
  submitLabel?: string;
};
