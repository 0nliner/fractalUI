import {
  Slider as AriaSlider,
  SliderTrack,
  SliderThumb,
  SliderOutput,
  Label,
  type SliderProps as AriaSliderProps,
} from 'react-aria-components';
import * as f from '../field/field.css';
import * as s from './Slider.css';

export type SliderProps = Omit<AriaSliderProps, 'className' | 'children'> & {
  label?: string;
  /** Форматирование подписи значения — например цены в рублях. */
  formatValue?: (value: number | number[]) => string;
};

/**
 * Ползунок, в том числе диапазонный.
 *
 * Диапазон включается сам, когда `value`/`defaultValue` — массив: RAC рендерит
 * столько ручек, сколько чисел. Нужен фасету цены, где выбирают «от и до».
 *
 * Заливка активного участка считается в процентах прямо в рендере — CSS так
 * не умеет, а `state` от RAC даёт готовые доли позиций.
 */
export function Slider({ label, formatValue, ...props }: SliderProps) {
  return (
    <AriaSlider {...props} className={f.root}>
      <div className={s.header}>
        {label ? <Label className={f.label}>{label}</Label> : null}
        <SliderOutput className={s.output}>
          {({ state }) =>
            formatValue
              ? formatValue(state.values.length === 1 ? state.values[0]! : state.values)
              : state.values.map((_, i) => state.getThumbValueLabel(i)).join(' — ')
          }
        </SliderOutput>
      </div>
      <SliderTrack className={s.track}>
        {({ state }) => (
          <>
            <div className={s.rail} />
            <div
              className={s.fill}
              style={{
                left: `${(state.values.length > 1 ? state.getThumbPercent(0) : 0) * 100}%`,
                right: `${(1 - state.getThumbPercent(state.values.length - 1)) * 100}%`,
              }}
            />
            {state.values.map((_, i) => (
              <SliderThumb key={i} index={i} className={s.thumb} />
            ))}
          </>
        )}
      </SliderTrack>
    </AriaSlider>
  );
}
