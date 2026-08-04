import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  ColorArea,
  ColorField,
  ColorSlider,
  ColorSwatch,
  ColorSwatchPicker,
  ColorSwatchPickerItem,
  ColorThumb,
  Input,
  SliderTrack,
  parseColor,
  type Color,
} from 'react-aria-components';
import * as s from './ColorPopover.css';
import { PRESET_COLORS, PRESET_COLORS_LIGHT } from './palettes';

const RECENTS_KEY = 'fractalui_recent_colors';
const RECENTS_MAX = 12;

function readRecents(): string[] {
  try {
    const raw = localStorage.getItem(RECENTS_KEY);
    const arr = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(arr) ? (arr.filter((x) => typeof x === 'string') as string[]) : [];
  } catch {
    return [];
  }
}
function pushRecent(hex: string): string[] {
  const cur = readRecents().filter((c) => c.toLowerCase() !== hex.toLowerCase());
  const next = [hex, ...cur].slice(0, RECENTS_MAX);
  try {
    localStorage.setItem(RECENTS_KEY, JSON.stringify(next));
  } catch {
    /* SSR / private mode — недавние просто не сохраняются */
  }
  return next;
}

function safeParse(value: string | undefined, fallback: string): Color {
  try {
    return parseColor(value || fallback);
  } catch {
    return parseColor(fallback);
  }
}

export interface ColorPopoverProps {
  x: number;
  y: number;
  /** Текущее значение (hex) — для инициализации. */
  value?: string;
  /** Заголовок («Цвет текста» / «Цвет фона»). */
  title: string;
  /** Живое применение цвета (hex) или сброс (undefined). */
  onChange: (hex: string | undefined) => void;
  onClose: () => void;
}

/**
 * Пипетка блока: площадка S/B + слайдер оттенка + hex-поле + пресеты (Open Color)
 * + недавние цвета + сброс. Портал в body, позиционируется у курсора; закрытие —
 * Esc / клик снаружи (как PortalMenu, помечена `data-editor-menu`).
 */
export function ColorPopover({ x, y, value, title, onChange, onClose }: ColorPopoverProps) {
  const [color, setColor] = useState<Color>(() => safeParse(value, '#3e8f78'));
  const [recents, setRecents] = useState<string[]>(() => readRecents());
  const boxRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ left: x, top: y });

  // Живое применение + запоминание.
  const applyLive = (c: Color) => {
    setColor(c);
    onChange(c.toString('hex'));
  };
  const commit = (c: Color) => setRecents(pushRecent(c.toString('hex')));

  // Клампим в вьюпорт после монтирования (ширина/высота известны).
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const left = Math.min(x, window.innerWidth - r.width - 8);
    const top = Math.min(y, window.innerHeight - r.height - 8);
    setPos({ left: Math.max(8, left), top: Math.max(8, top) });
  }, [x, y]);

  // Закрытие: Esc (capture, чтобы не всплывало) + клик снаружи.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopImmediatePropagation();
        onClose();
      }
    };
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node | null;
      if (t && boxRef.current?.contains(t)) return;
      onClose();
    };
    window.addEventListener('keydown', onKey, true);
    window.addEventListener('mousedown', onDown, true);
    return () => {
      window.removeEventListener('keydown', onKey, true);
      window.removeEventListener('mousedown', onDown, true);
    };
  }, [onClose]);

  const presetItems = useMemo(() => [...PRESET_COLORS, ...PRESET_COLORS_LIGHT], []);

  return createPortal(
    <div
      ref={boxRef}
      className={s.popover}
      data-editor-menu="true"
      style={{ left: pos.left, top: pos.top }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div className={s.header}>
        <span className={s.title}>{title}</span>
        <button
          type="button"
          className={s.reset}
          onClick={() => {
            onChange(undefined);
            onClose();
          }}
        >
          Без цвета
        </button>
      </div>

      <ColorArea
        className={s.area}
        colorSpace="hsb"
        xChannel="saturation"
        yChannel="brightness"
        value={color}
        onChange={setColor}
        onChangeEnd={applyLive}
      >
        <ColorThumb className={s.thumb} />
      </ColorArea>

      <ColorSlider className={s.slider} colorSpace="hsb" channel="hue" value={color} onChange={setColor} onChangeEnd={applyLive}>
        <SliderTrack className={s.sliderTrack}>
          <ColorThumb className={s.thumb} />
        </SliderTrack>
      </ColorSlider>

      <div className={s.row}>
        <ColorField
          className={s.field}
          value={color}
          onChange={(c) => {
            if (!c) return;
            applyLive(c);
            commit(c);
          }}
        >
          <Input className={s.input} aria-label="HEX" />
        </ColorField>
        <ColorSwatch className={s.preview} color={color} />
      </div>

      <div className={s.sectionLabel}>Пресеты</div>
      <ColorSwatchPicker
        className={s.swatches}
        value={color}
        onChange={(c) => {
          applyLive(c);
          commit(c);
        }}
      >
        {presetItems.map((hex) => (
          <ColorSwatchPickerItem key={hex} color={hex} className={s.swatchItem}>
            <ColorSwatch className={s.swatch} />
          </ColorSwatchPickerItem>
        ))}
      </ColorSwatchPicker>

      {recents.length > 0 && (
        <>
          <div className={s.sectionLabel}>Недавние</div>
          <div className={s.recents}>
            {recents.map((hex) => (
              <button
                key={hex}
                type="button"
                className={s.swatch}
                style={{ background: hex }}
                aria-label={hex}
                title={hex}
                onClick={() => applyLive(safeParse(hex, '#000000'))}
              />
            ))}
          </div>
        </>
      )}
    </div>,
    document.body,
  );
}
