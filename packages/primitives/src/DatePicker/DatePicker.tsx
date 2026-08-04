import {
  DatePicker as AriaDatePicker,
  Label,
  Group,
  DateInput,
  DateSegment,
  Button,
  Popover,
  Dialog,
  Calendar,
  CalendarGrid,
  CalendarGridHeader,
  CalendarHeaderCell,
  CalendarGridBody,
  CalendarCell,
  Heading,
  type DateValue,
} from 'react-aria-components';
import { parseDate, type CalendarDate } from '@internationalized/date';
import * as s from './DatePicker.css';

/** 'YYYY-MM-DD' → CalendarDate; битое/пустое → null (без исключений). */
export function safeParseDate(iso: string | null | undefined): CalendarDate | null {
  if (!iso) return null;
  try {
    return parseDate(iso);
  } catch {
    return null;
  }
}

export type DatePickerProps = {
  /** ISO-дата 'YYYY-MM-DD' или null. */
  value: string | null;
  onChange: (value: string | null) => void;
  label?: string;
  /** ISO-границы выбора. */
  min?: string;
  max?: string;
  isDisabled?: boolean;
  'aria-label'?: string;
};

/**
 * Одиночный выбор даты на React Aria (`DatePicker` + `Calendar`). Значение —
 * date-only ISO-строка (без таймзоны, как в приложении); маппинг через
 * `@internationalized/date`. Стили — только `vars.*`.
 */
export function DatePicker({ value, onChange, label, min, max, isDisabled, ...aria }: DatePickerProps) {
  return (
    <AriaDatePicker
      className={s.field}
      value={safeParseDate(value)}
      onChange={(d: DateValue | null) => onChange(d ? d.toString() : null)}
      minValue={safeParseDate(min) ?? undefined}
      maxValue={safeParseDate(max) ?? undefined}
      isDisabled={isDisabled}
      aria-label={aria['aria-label'] ?? label}
    >
      {label ? <Label className={s.label}>{label}</Label> : null}
      <Group className={s.group}>
        <DateInput className={s.dateInput}>
          {(segment) => <DateSegment segment={segment} className={s.segment} />}
        </DateInput>
        <Button className={s.trigger} aria-label="Открыть календарь">
          ▾
        </Button>
      </Group>
      <Popover className={s.popover}>
        <Dialog className={s.dialog}>
          <Calendar>
            <header className={s.calHeader}>
              <Button slot="previous" className={s.calNav} aria-label="Предыдущий месяц">
                ‹
              </Button>
              <Heading className={s.calHeading} />
              <Button slot="next" className={s.calNav} aria-label="Следующий месяц">
                ›
              </Button>
            </header>
            <CalendarGrid className={s.grid}>
              <CalendarGridHeader>
                {(day) => <CalendarHeaderCell className={s.gridHeaderCell}>{day}</CalendarHeaderCell>}
              </CalendarGridHeader>
              <CalendarGridBody>
                {(date) => <CalendarCell date={date} className={s.cell} />}
              </CalendarGridBody>
            </CalendarGrid>
          </Calendar>
        </Dialog>
      </Popover>
    </AriaDatePicker>
  );
}
