import { createTheme } from '@vanilla-extract/css';
import { vars } from '../contract.css';
import { darkValues } from './values';

/** Класс тёмной темы. Навесь на корень приложения: `<div className={darkTheme}>`. */
export const darkTheme = createTheme(vars, darkValues);
