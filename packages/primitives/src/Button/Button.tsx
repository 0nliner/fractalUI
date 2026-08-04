import { Button as AriaButton, type ButtonProps as AriaButtonProps } from 'react-aria-components';
import * as s from './Button.css';

export type ButtonProps = AriaButtonProps & {
  variant?: keyof typeof s.variant;
  size?: keyof typeof s.size;
};

/** Кнопка на React Aria + токенах fractalUI. Состояния — через data-атрибуты RAC. */
export function Button({ variant = 'primary', size = 'md', className, ...props }: ButtonProps) {
  return (
    <AriaButton
      {...props}
      className={(renderProps) =>
        [
          s.variant[variant],
          s.size[size],
          typeof className === 'function' ? className(renderProps) : className,
        ]
          .filter(Boolean)
          .join(' ')
      }
    />
  );
}
