import {
  DateRangePicker as AriaDateRangePicker,
  Label,
  Group,
  DateInput,
  DateSegment,
  Button,
  Popover,
  Dialog,
  RangeCalendar,
  CalendarGrid,
  CalendarGridHeader,
  CalendarHeaderCell,
  CalendarGridBody,
  CalendarCell,
  Heading,
  type DateValue,
  type RangeValue,
} from 'react-aria-components';
import { DatePicker, safeParseDate } from '../DatePicker/DatePicker';
import * as base from '../DatePicker/DatePicker.css';
import * as s from './DateRangePicker.css';

/** Диапазон дат как пара ISO-строк; любой конец может быть null. */
export type IsoDateRange = { start: string | null; end: string | null };

export type DateRangePickerProps = {
  value: IsoDateRange | null;
  onChange: (value: IsoDateRange) => void;
  label?: string;
  /** ISO-границы выбора. */
  min?: string;
  max?: string;
  /**
   * Разрешить «полу-диапазон» (только дедлайн без старта). react-aria не держит
   * полуоткрытый range, поэтому в этом режиме показываем одиночный `DatePicker`
   * (правит конец/дедлайн) + кнопку «+ старт», разворачивающую диапазон.
   */
  allowSingle?: boolean;
  isDisabled?: boolean;
};

/**
 * Выбор диапазона дат одним компонентом на React Aria (`DateRangePicker` +
 * `RangeCalendar`). Значение — пара date-only ISO-строк; маппинг через
 * `@internationalized/date`. Стили — только `vars.*` (поле/календарь общие с
 * `DatePicker`).
 */
export function DateRangePicker({
  value,
  onChange,
  label,
  min,
  max,
  allowSingle,
  isDisabled,
}: DateRangePickerProps) {
  const start = value?.start ?? null;
  const end = value?.end ?? null;
  const bothSet = !!start && !!end;

  // Полу-диапазон: правим «конец» (дедлайн) одиночным пикером.
  if (allowSingle && !bothSet) {
    const single = end ?? start;
    return (
      <div className={s.singleWrap}>
        <DatePicker
          label={label}
          value={single}
          onChange={(d) => onChange({ start: null, end: d })}
          min={min}
          max={max}
          isDisabled={isDisabled}
        />
        {single && !isDisabled ? (
          <button
            type="button"
            className={s.addBtn}
            onClick={() => onChange({ start: single, end: single })}
          >
            + старт
          </button>
        ) : null}
      </div>
    );
  }

  const ps = safeParseDate(start);
  const pe = safeParseDate(end);
  const racValue: RangeValue<DateValue> | null = ps && pe ? { start: ps, end: pe } : null;

  return (
    <AriaDateRangePicker
      className={base.field}
      value={racValue}
      onChange={(r) =>
        onChange(r ? { start: r.start.toString(), end: r.end.toString() } : { start: null, end: null })
      }
      minValue={safeParseDate(min) ?? undefined}
      maxValue={safeParseDate(max) ?? undefined}
      isDisabled={isDisabled}
      aria-label={label}
    >
      {label ? <Label className={base.label}>{label}</Label> : null}
      <div className={s.groupRow}>
        <Group className={base.group}>
          <DateInput slot="start" className={base.dateInput}>
            {(segment) => <DateSegment segment={segment} className={base.segment} />}
          </DateInput>
          <span aria-hidden className={s.sep}>
            –
          </span>
          <DateInput slot="end" className={base.dateInput}>
            {(segment) => <DateSegment segment={segment} className={base.segment} />}
          </DateInput>
          <Button className={base.trigger} aria-label="Открыть календарь">
            ▾
          </Button>
        </Group>
        {allowSingle && !isDisabled ? (
          <button
            type="button"
            className={s.clearBtn}
            aria-label="Очистить период"
            onClick={() => onChange({ start: null, end: null })}
          >
            ×
          </button>
        ) : null}
      </div>
      <Popover className={base.popover}>
        <Dialog className={base.dialog}>
          <RangeCalendar>
            <header className={base.calHeader}>
              <Button slot="previous" className={base.calNav} aria-label="Предыдущий месяц">
                ‹
              </Button>
              <Heading className={base.calHeading} />
              <Button slot="next" className={base.calNav} aria-label="Следующий месяц">
                ›
              </Button>
            </header>
            <CalendarGrid className={base.grid}>
              <CalendarGridHeader>
                {(day) => <CalendarHeaderCell className={base.gridHeaderCell}>{day}</CalendarHeaderCell>}
              </CalendarGridHeader>
              <CalendarGridBody>
                {(date) => <CalendarCell date={date} className={base.cell} />}
              </CalendarGridBody>
            </CalendarGrid>
          </RangeCalendar>
        </Dialog>
      </Popover>
    </AriaDateRangePicker>
  );
}
