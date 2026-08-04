// @fractalui/primitives — L1 чистые presentational-компоненты.
// Стек: React Aria Components + стили из @fractalui/tokens (vanilla-extract).
// Без сети и стора — данные приходят через props.
export { Button, type ButtonProps } from './Button/Button';
export { Switch, type SwitchProps } from './Switch/Switch';
export { Badge, type BadgeProps } from './Badge/Badge';
// Поля формы. Общее у них — только стили (./field/field.css), не компонент:
// у каждого поля React Aria свой корень, и обёртка ломала бы контекст, через
// который Label, Text и FieldError находят своё поле.
export { TextField, type TextFieldProps } from './TextField/TextField';
export { TextArea, type TextAreaProps } from './TextArea/TextArea';
export { NumberField, type NumberFieldProps } from './NumberField/NumberField';
export { Select, type SelectProps, type SelectOption } from './Select/Select';
export { ComboBox, type ComboBoxProps, type ComboBoxOption } from './ComboBox/ComboBox';
export {
  Checkbox,
  CheckboxGroup,
  type CheckboxProps,
  type CheckboxGroupProps,
} from './Checkbox/Checkbox';
export { RadioGroup, Radio, type RadioGroupProps, type RadioProps } from './RadioGroup/RadioGroup';
export { Slider, type SliderProps } from './Slider/Slider';
// Оверлеи. Dialog ниже media.md становится нижним листом — на телефоне
// центрированное окно перекрывается клавиатурой.
export { Dialog, DialogTrigger, type DialogProps } from './Dialog/Dialog';
export {
  Menu,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
  type MenuProps,
  type MenuItemProps,
} from './Menu/Menu';
export { Dropzone, type DropzoneProps } from './Dropzone/Dropzone';
export { Card, type CardProps } from './Card/Card';
export { Avatar, type AvatarProps } from './Avatar/Avatar';
export { LavaLamp, type LavaLampProps } from './LavaLamp/LavaLamp';
export { ActionsList, type ActionsListProps, type ActionItem } from './ActionsList/ActionsList';
export { Drawer, type DrawerProps } from './Drawer/Drawer';
export { ImageLightbox, type ImageLightboxProps } from './ImageLightbox/ImageLightbox';
export { Tooltip, type TooltipProps } from './Tooltip/Tooltip';
export { Tabs, type TabsProps, type TabItem } from './Tabs/Tabs';
export { Notification, type NotificationProps, type NotificationStatus } from './Notification/Notification';
export { FloatingWidget, type FloatingWidgetProps } from './FloatingWidget/FloatingWidget';
// Навигация плотных приложений: рейл 48px + якорный флайаут раздела.
export { NavRail, type NavRailProps, type NavRailItem } from './NavRail/NavRail';
export { NavFlyout, type NavFlyoutProps, type NavFlyoutItem } from './NavFlyout/NavFlyout';
// Wireframe-«болванки» для макетов (см. скилл fractalui-ux, раздел «Метод макетов»).
export {
  WireframeProvider,
  WireframeContext,
  Bar,
  Av,
  Btn,
  Stack,
  Shimmer,
  Field,
  Block,
  MasterGrid,
  span,
  type BlockProps,
} from './Wireframe/Wireframe';
export * from './Tree/Tree';
export { Breadcrumbs, type BreadcrumbsProps, type BreadcrumbItem } from './Breadcrumbs/Breadcrumbs';
export { ViewSwitcher, type ViewSwitcherProps, type ViewSwitcherItem } from './ViewSwitcher/ViewSwitcher';
// Панель со шторкой + чат агента: обе штуки повторяются из проекта в проект.
export { ResizablePanel, type ResizablePanelProps } from './ResizablePanel/ResizablePanel';
export { DatePicker, type DatePickerProps } from './DatePicker/DatePicker';
export {
  DateRangePicker,
  type DateRangePickerProps,
  type IsoDateRange,
} from './DateRangePicker/DateRangePicker';
export {
  AgentChat,
  type AgentChatProps,
  type AgentChatIcons,
  type AgentMessage,
  type AgentToolCall,
  type AgentConversation,
} from './AgentChat/AgentChat';
// Полоса вкладок открытых документов — как в редакторе кода и в браузере.
export { EditorTabs, type EditorTabsProps, type EditorTab } from './EditorTabs/EditorTabs';
// Блочный редактор документа. Всё прикладное (загрузка файлов, источник страниц
// для ссылок, KaTeX, подсветка кода) приходит колбэками — см. BlockEditorProps.
export { BLOCK_MIME } from './Editor/BlockRow';
export { BlockEditor, type BlockEditorProps } from './Editor/BlockEditor';
export type {
  EditorBlock,
  EditorBlockType,
  BlockType,
  BlockLayout,
  CustomBlockDef,
  CustomBlockRenderProps,
  EditorIconName,
  EditorIcons,
  EditorLanguage,
  EditorPageRef,
  EditorUpload,
  CellAlign,
} from './Editor/types';
