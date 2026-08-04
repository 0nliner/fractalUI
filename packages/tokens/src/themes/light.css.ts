import { createTheme } from '@vanilla-extract/css';
import { vars } from '../contract.css';
import { lightValues } from './values';

/** Класс светлой темы. Навесь на корень приложения: `<div className={lightTheme}>`. */
export const lightTheme = createTheme(vars, lightValues);
