import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { vars } from '@fractalui/tokens';
import {
  Button,
  Drawer,
  FloatingWidget,
  Tooltip,
  TextField,
  ImageLightbox,
} from '@fractalui/primitives';

const meta: Meta = { title: 'Components/Overlays' };
export default meta;

// Самодостаточная картинка (без сети) для лайтбокса.
const DEMO_IMG =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="400"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2dd4bf"/><stop offset="1" stop-color="#4ade80"/></linearGradient></defs><rect width="640" height="400" fill="url(#g)"/><text x="320" y="210" font-size="40" text-anchor="middle" fill="#0b1220" font-family="sans-serif">fractalUI</text></svg>`,
  );

export const DrawerDemo: StoryObj = {
  render: function DrawerStory() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onPress={() => setOpen(true)}>Открыть панель</Button>
        <Drawer isOpen={open} onOpenChange={setOpen} title="Редактирование">
          <TextField label="Имя" placeholder="Иван" />
          <TextField label="Email" placeholder="ivan@example.com" />
          <div style={{ display: 'flex', gap: vars.space.sm, marginTop: vars.space.sm }}>
            <Button onPress={() => setOpen(false)}>Сохранить</Button>
            <Button variant="ghost" onPress={() => setOpen(false)}>
              Отмена
            </Button>
          </div>
        </Drawer>
      </>
    );
  },
};

/** Ширину панели можно менять, потянув за внутренний край (или стрелками с фокусом на шторке). */
export const ResizableDrawerDemo: StoryObj = {
  render: function ResizableDrawerStory() {
    const [open, setOpen] = useState(false);
    const [width, setWidth] = useState(460);
    return (
      <>
        <Button onPress={() => setOpen(true)}>Открыть resizable-панель ({width}px)</Button>
        <Drawer
          isOpen={open}
          onOpenChange={setOpen}
          title="Задача"
          resizable
          width={width}
          onWidthChange={setWidth}
          min={360}
          max={900}
        >
          <p style={{ color: vars.color.muted, fontSize: vars.font.sizeSm }}>
            Потяните левый край панели, чтобы изменить ширину.
          </p>
          <TextField label="Название" placeholder="…" />
        </Drawer>
      </>
    );
  },
};

/** Полноэкранный просмотр: Ctrl+колесо — зум, перетаскивание — пан, двойной клик — сброс. */
export const ImageLightboxDemo: StoryObj = {
  render: function ImageLightboxStory() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <img
          src={DEMO_IMG}
          alt="демо"
          style={{ width: 220, borderRadius: vars.radius.md, cursor: 'zoom-in' }}
          onClick={() => setOpen(true)}
        />
        <ImageLightbox src={DEMO_IMG} alt="демо" isOpen={open} onOpenChange={setOpen} />
      </>
    );
  },
};

export const TooltipDemo: StoryObj = {
  render: () => (
    <Tooltip content="Подсказка на React Aria">
      <Button variant="secondary">Наведи на меня</Button>
    </Tooltip>
  ),
};

export const FloatingWidgetDemo: StoryObj = {
  render: () => (
    <div style={{ position: 'relative', height: 320 }}>
      <FloatingWidget title="Перетащи меня" defaultX={40} defaultY={40}>
        <div style={{ color: vars.color.muted, fontSize: vars.font.sizeSm }}>
          Тащится за плашку.
        </div>
        <Button size="sm" variant="brand" style={{ marginTop: vars.space.sm }}>
          Действие
        </Button>
      </FloatingWidget>
    </div>
  ),
};
