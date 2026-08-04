import {
  Checkbox as AriaCheckbox,
  CheckboxGroup as AriaCheckboxGroup,
  Label,
  Text,
  FieldError,
  type CheckboxProps as AriaCheckboxProps,
  type CheckboxGroupProps as AriaCheckboxGroupProps,
} from 'react-aria-components';
import type { ReactNode } from 'react';
import * as f from '../field/field.css';
import * as s from './Checkbox.css';

export type CheckboxProps = Omit<AriaCheckboxProps, 'className' | 'children'> & {
  children?: ReactNode;
};

/**
 * Флажок.
 *
 * Галочка рисуется SVG, а не псевдоэлементом с `content`: так она наследует
 * `currentColor`, корректно масштабируется и не зависит от шрифта.
 * Промежуточное состояние (`isIndeterminate`) нужно заголовку группы фасетов
 * и «выбрать все» в таблице.
 */
export function Checkbox({ children, ...props }: CheckboxProps) {
  return (
    <AriaCheckbox {...props} className={s.root}>
      {({ isSelected, isIndeterminate }) => (
        <>
          <span className={s.box} aria-hidden>
            {isIndeterminate ? (
              <svg viewBox="0 0 16 16" className={s.mark}>
                <path d="M4 8h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            ) : isSelected ? (
              <svg viewBox="0 0 16 16" className={s.mark}>
                <path
                  d="M3.5 8.5l3 3 6-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : null}
          </span>
          {children ? <span className={s.label}>{children}</span> : null}
        </>
      )}
    </AriaCheckbox>
  );
}

export type CheckboxGroupProps = Omit<AriaCheckboxGroupProps, 'className' | 'children'> & {
  label?: string;
  description?: string;
  errorMessage?: string;
  children?: ReactNode;
};

/** Группа флажков: фасеты каталога, выбор способов доставки. */
export function CheckboxGroup({
  label,
  description,
  errorMessage,
  children,
  ...props
}: CheckboxGroupProps) {
  return (
    <AriaCheckboxGroup {...props} className={f.root}>
      {label ? <Label className={f.label}>{label}</Label> : null}
      <div className={s.group}>{children}</div>
      {description ? (
        <Text slot="description" className={f.description}>
          {description}
        </Text>
      ) : null}
      <FieldError className={f.errorText}>{errorMessage}</FieldError>
    </AriaCheckboxGroup>
  );
}
