import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { vars } from '@fractalui/tokens';
import {
  TextField,
  Switch,
  DatePicker,
  DateRangePicker,
  type IsoDateRange,
} from '@fractalui/primitives';

const meta: Meta = { title: 'Components/Fields' };
export default meta;

export const TextFields: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: vars.space.lg, maxWidth: 360 }}>
      <TextField label="Имя" placeholder="Иван Иванов" />
      <TextField label="Email" placeholder="ivan@example.com" description="Корпоративная почта" />
      <TextField label="Токен" placeholder="•••••" isInvalid errorMessage="Обязательное поле" />
      <TextField label="Заблокировано" placeholder="—" isDisabled />
    </div>
  ),
};

/** Одиночная дата и диапазон одним компонентом. `allowSingle` держит «только дедлайн». */
export const DatePickers: StoryObj = {
  render: function DatePickersStory() {
    const [day, setDay] = useState<string | null>('2026-08-05');
    const [range, setRange] = useState<IsoDateRange | null>({ start: '2026-08-01', end: '2026-08-09' });
    const [due, setDue] = useState<IsoDateRange | null>({ start: null, end: '2026-08-12' });
    const [empty, setEmpty] = useState<IsoDateRange | null>(null);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: vars.space.lg, maxWidth: 360 }}>
        <DatePicker label="Дата" value={day} onChange={setDay} />
        <div style={{ fontSize: 12, color: vars.color.muted }}>value: {day ?? 'null'}</div>

        <DateRangePicker label="Период (диапазон)" value={range} onChange={setRange} />
        <div style={{ fontSize: 12, color: vars.color.muted }}>
          {range?.start ?? 'null'} → {range?.end ?? 'null'}
        </div>

        <DateRangePicker label="Только дедлайн (allowSingle)" value={due} onChange={setDue} allowSingle />
        <div style={{ fontSize: 12, color: vars.color.muted }}>
          {due?.start ?? 'null'} → {due?.end ?? 'null'}
        </div>

        <DateRangePicker label="Пусто (allowSingle)" value={empty} onChange={setEmpty} allowSingle />
      </div>
    );
  },
};

export const Switches: StoryObj = {
  render: function SwitchesStory() {
    const [on, setOn] = useState(true);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: vars.space.md }}>
        <Switch isSelected={on} onChange={setOn}>
          Уведомления {on ? 'вкл' : 'выкл'}
        </Switch>
        <Switch defaultSelected>Авто-обновление</Switch>
        <Switch isDisabled>Недоступно</Switch>
      </div>
    );
  },
};
