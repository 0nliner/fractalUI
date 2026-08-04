// @fractalui/patterns — L2 schema-driven компоненты.
// Данные и колбэки приходят через props/render-props — НЕ из стора и НЕ из SDK.
// Стек: TanStack Table (таблицы), React Hook Form + AJV (формы).
export { AutoTable } from './AutoTable/AutoTable';
export type { AutoColumn, AutoTableProps } from './AutoTable/types';
export { AutoForm } from './AutoForm/AutoForm';
export type { AutoFormProps, AutoFormValues, ObjectSchema, FieldSchema } from './AutoForm/types';
export { Navigation, type NavigationProps } from './Navigation/Navigation';
export { Feed, type FeedField, type FeedProps } from './Feed/Feed';
export { Search, type SearchProps } from './Search/Search';
// Каркас плотного приложения: тонкая шапка + рейл 48px + якорные флайауты.
export { AppShell, type AppShellProps, type ShellSection } from './AppShell/AppShell';
// Пристыкованная растягиваемая панель (ассистент/инспектор) для слота rightDock.
export { DockPanel, type DockPanelProps } from './DockPanel/DockPanel';
// Галерея wireframe-макетов с тумблерами «Аннотации»/«Скелетоны».
export { DesignGallery, type DesignGalleryProps, type DesignScreen } from './DesignGallery/DesignGallery';
