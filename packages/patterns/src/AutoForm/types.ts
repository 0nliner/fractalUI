/** Упрощённая JSON-схема поля (подмножество, нужное для генерации формы). */
export type FieldSchema = {
  type: 'string' | 'number' | 'integer' | 'boolean' | 'array';
  title?: string;
  description?: string;
  placeholder?: string;
  enum?: string[];
  /** Подписи вариантов, если сырое значение enum показывать не хочется. */
  enumLabels?: Record<string, string>;
  /** Для `type: 'array'` — тип элементов. Поддерживается только массив строк. */
  items?: { type: 'string'; enum?: string[] };
  minimum?: number;
  maximum?: number;
  /**
   * Явный выбор контрола, когда по типу его не угадать: `textarea` вместо
   * однострочного поля, `radio` вместо выпадающего списка, `date`, `file`.
   * Без него длинное описание товара приезжает в `<input>`, а дата — строкой.
   */
  'x-widget'?:
    | 'textarea'
    | 'select'
    | 'radio'
    | 'date'
    | 'file'
    | 'number'
    | 'text'
    | 'password'
    | 'email';
  /** Для `x-widget: 'file'` — что принимать, например `['image/*']`. */
  'x-accept'?: string[];
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
  onSubmit: (data: AutoFormValues) => void | Promise<void>;
  submitLabel?: string;
  /**
   * Ошибки от сервера: «имя поля → сообщение».
   *
   * Ради этого пропа всё и затевалось. FastAPI отдаёт ошибки валидации массивом
   * с `loc`, и разобранная карта полей уже строится на стороне приложения
   * (`normalizeApiError` в CraftSphere). Без такого входа она пропадала впустую:
   * форма могла показать только общий текст, а подсветить конкретное поле — нет.
   */
  serverErrors?: Record<string, string>;
  /** Блокирует форму на время отправки. */
  isSubmitting?: boolean;
  /** Ошибка, не привязанная к полю: «неверный логин или пароль». */
  formError?: string | null;
};
