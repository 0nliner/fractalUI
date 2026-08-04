import {
  RadioGroup as AriaRadioGroup,
  Radio as AriaRadio,
  Label,
  Text,
  FieldError,
  type RadioGroupProps as AriaRadioGroupProps,
  type RadioProps as AriaRadioProps,
} from 'react-aria-components';
import type { ReactNode } from 'react';
import * as f from '../field/field.css';
import * as s from './RadioGroup.css';

export type RadioProps = Omit<AriaRadioProps, 'className' | 'children'> & {
  children?: ReactNode;
  description?: string;
};

/** Один вариант выбора. Используется только внутри `RadioGroup`. */
export function Radio({ children, description, ...props }: RadioProps) {
  return (
    <AriaRadio {...props} className={s.radio}>
      <span className={s.dot} aria-hidden />
      <span className={s.body}>
        <span>{children}</span>
        {description ? <span className={s.description}>{description}</span> : null}
      </span>
    </AriaRadio>
  );
}

export type RadioGroupProps = Omit<AriaRadioGroupProps, 'className' | 'children'> & {
  label?: string;
  description?: string;
  errorMessage?: string;
  /** Горизонтально — для двух-трёх коротких вариантов. */
  orientation?: 'vertical' | 'horizontal';
  children?: ReactNode;
};

/**
 * Взаимоисключающий выбор: способ доставки, сортировка, роль при регистрации.
 *
 * От `Select` отличается тем, что все варианты видны сразу — это важно, когда
 * их два-три и выбор влияет на цену или сроки.
 */
export function RadioGroup({
  label,
  description,
  errorMessage,
  orientation = 'vertical',
  children,
  ...props
}: RadioGroupProps) {
  return (
    <AriaRadioGroup {...props} className={f.root}>
      {label ? <Label className={f.label}>{label}</Label> : null}
      <div className={orientation === 'horizontal' ? s.groupRow : s.groupColumn}>{children}</div>
      {description ? (
        <Text slot="description" className={f.description}>
          {description}
        </Text>
      ) : null}
      <FieldError className={f.errorText}>{errorMessage}</FieldError>
    </AriaRadioGroup>
  );
}
