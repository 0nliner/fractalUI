import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  Button,
  Checkbox,
  CheckboxGroup,
  ComboBox,
  Dialog,
  DialogTrigger,
  Dropzone,
  Menu,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
  NumberField,
  Radio,
  RadioGroup,
  Select,
  Slider,
  TextArea,
  TextField,
} from '@fractalui/primitives';
import { vars } from '@fractalui/tokens';
import { Title } from '../_ui';

const TAGS = [
  { id: 'ceramics', label: 'Керамика' },
  { id: 'wood', label: 'Дерево' },
  { id: 'textile', label: 'Текстиль' },
  { id: 'jewelry', label: 'Украшения' },
];

function Column({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'grid', gap: vars.space.lg, maxWidth: 420 }}>{children}</div>
  );
}

function Fields() {
  const [query, setQuery] = useState('');
  const [files, setFiles] = useState<string[]>([]);

  const filtered = TAGS.filter((t) => t.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <div style={{ display: 'grid', gap: vars.space.xl3, gridTemplateColumns: '1fr 1fr' }}>
      <Column>
        <Title>Ввод</Title>
        <TextField label="Название" placeholder="Кружка ручной работы" />
        <TextArea
          label="Описание"
          placeholder="Расскажите о материалах и процессе…"
          description="До 2000 символов"
        />
        <NumberField label="Количество" defaultValue={1} minValue={1} maxValue={99} />
        <NumberField
          label="Цена, ₽"
          defaultValue={3500}
          minValue={0}
          step={100}
          hideSteppers
        />
        <TextField
          label="Email"
          placeholder="you@example.com"
          isInvalid
          errorMessage="Такой адрес уже зарегистрирован"
        />
      </Column>

      <Column>
        <Title>Выбор</Title>
        <Select
          label="Категория"
          options={[
            { id: 'ceramics', label: 'Керамика', description: 'Посуда, вазы, декор' },
            { id: 'wood', label: 'Дерево' },
            { id: 'textile', label: 'Текстиль' },
            { id: 'soap', label: 'Мыловарение', isDisabled: true },
          ]}
        />
        <ComboBox
          label="Теги"
          placeholder="Начните вводить…"
          options={filtered}
          onInputChange={setQuery}
          allowsCustomValue
          description="Можно ввести новый тег"
        />
        <CheckboxGroup label="Фильтры">
          <Checkbox value="in-stock">В наличии</Checkbox>
          <Checkbox value="handmade">Ручная работа</Checkbox>
          <Checkbox value="delivery">Есть доставка</Checkbox>
        </CheckboxGroup>
        <RadioGroup label="Сортировка" defaultValue="new">
          <Radio value="new">Сначала новые</Radio>
          <Radio value="cheap" description="С учётом скидок">
            Сначала дешёвые
          </Radio>
          <Radio value="rating">По рейтингу</Radio>
        </RadioGroup>
        <Slider
          label="Цена"
          defaultValue={[1000, 7000]}
          minValue={0}
          maxValue={10000}
          step={100}
          formatValue={(v) =>
            Array.isArray(v) ? `${v[0]} — ${v[1]} ₽` : `${v} ₽`
          }
        />
      </Column>

      <Column>
        <Title>Оверлеи</Title>
        <div style={{ display: 'flex', gap: vars.space.md, flexWrap: 'wrap' }}>
          <DialogTrigger>
            <Button>Открыть диалог</Button>
            <Dialog
              title="Удалить товар?"
              footer={({ close }) => (
                <>
                  <Button variant="secondary" onPress={close}>
                    Отмена
                  </Button>
                  <Button variant="danger" onPress={close}>
                    Удалить
                  </Button>
                </>
              )}
            >
              Товар исчезнет из каталога. Заказы, в которых он уже есть, сохранятся.
            </Dialog>
          </DialogTrigger>

          <MenuTrigger>
            <Button variant="secondary">Действия</Button>
            <Menu onAction={() => {}}>
              <MenuItem id="edit">Изменить</MenuItem>
              <MenuItem id="copy">Дублировать</MenuItem>
              <MenuSeparator />
              <MenuItem id="delete" isDestructive>
                Удалить
              </MenuItem>
            </Menu>
          </MenuTrigger>
        </div>
        <p style={{ color: vars.color.fgSubtle, fontSize: vars.font.sizeSm, margin: 0 }}>
          Ниже 768px диалог превращается в нижний лист — проверяется сменой viewport.
        </p>
      </Column>

      <Column>
        <Title>Файлы</Title>
        <Dropzone
          onFiles={(f) => setFiles(f.map((x) => x.name))}
          acceptedFileTypes={['image/*']}
          hint="PNG или JPEG, до 5 МБ"
        />
        {files.length ? (
          <ul style={{ margin: 0, paddingLeft: vars.space.xl, fontSize: vars.font.sizeSm }}>
            {files.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        ) : null}
      </Column>
    </div>
  );
}

const meta: Meta<typeof Fields> = { title: 'Components/Form fields', component: Fields };
export default meta;
export const All: StoryObj<typeof Fields> = {};
