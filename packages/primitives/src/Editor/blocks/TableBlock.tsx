import { memo, useEffect, useState, type ClipboardEvent } from 'react';
import { useEditorConfig } from '../context';
import * as s from '../BlockEditor.css';
import type { BlockViewProps, CellAlign } from '../types';

const ALIGNS: Exclude<CellAlign, null>[] = ['left', 'center', 'right'];

const DEFAULT_ROWS: string[][] = [
  ['Колонка 1', 'Колонка 2'],
  ['', ''],
];

/** Приводим таблицу к прямоугольнику: кривые данные ломают вёрстку. */
function normalize(rows: string[][] | undefined): string[][] {
  if (!rows || rows.length === 0) return DEFAULT_ROWS.map((r) => [...r]);
  const width = Math.max(1, ...rows.map((r) => r.length));
  return rows.map((r) => {
    const copy = [...r];
    while (copy.length < width) copy.push('');
    return copy.slice(0, width);
  });
}

const alignToCss = (a: CellAlign): 'left' | 'center' | 'right' =>
  a === 'center' ? 'center' : a === 'right' ? 'right' : 'left';

export const TableBlock = memo(function TableBlock(p: BlockViewProps) {
  const { icons } = useEditorConfig();
  const [rows, setRows] = useState<string[][]>(() => normalize(p.block.rows));

  // Правку снаружи подхватываем, только пока пользователь не сидит в ячейке —
  // иначе агент затирает набранное на полуслове.
  useEffect(() => {
    if (document.activeElement?.tagName === 'INPUT') return;
    setRows(normalize(p.block.rows));
  }, [p.block.rows]);

  const width = rows[0]?.length ?? 0;
  const align = p.block.align ?? [];

  const commit = (next: string[][]) => {
    setRows(next);
    p.onUpdate({ rows: next });
  };

  const addRow = () => commit([...rows, Array<string>(width).fill('')]);
  const addCol = () => commit(rows.map((row, i) => [...row, i === 0 ? `Колонка ${width + 1}` : '']));
  const delRow = (r: number) => {
    if (rows.length > 1) commit(rows.filter((_, i) => i !== r));
  };
  const delCol = (c: number) => {
    if (width <= 1) return;
    setRows(rows.map((row) => row.filter((_, i) => i !== c)));
    p.onUpdate({
      rows: rows.map((row) => row.filter((_, i) => i !== c)),
      align: align.filter((_, i) => i !== c),
    });
  };

  const setAlign = (c: number, value: CellAlign) => {
    const next = [...align];
    next[c] = value;
    p.onUpdate({ align: next });
  };

  // Вставка из буфера: TSV/таблица (табы+переносы) раскладывается в ячейки от
  // текущей (r,c), расширяя таблицу. Одиночное значение — обычная вставка.
  const handlePaste = (e: ClipboardEvent<HTMLInputElement>, r: number, c: number) => {
    const text = e.clipboardData.getData('text/plain');
    if (!text || (!text.includes('\t') && !/\r?\n/.test(text.trim()))) return;
    e.preventDefault();
    const grid = text
      .replace(/\r/g, '')
      .replace(/\n+$/, '')
      .split('\n')
      .map((line) => line.split('\t'));
    const next = rows.map((row) => [...row]);
    for (let i = 0; i < grid.length; i++) {
      const line = grid[i];
      if (!line) continue;
      const target = (next[r + i] ??= []);
      for (let j = 0; j < line.length; j++) target[c + j] = line[j] ?? '';
    }
    commit(normalize(next));
  };

  if (p.readOnly) {
    return (
      <div className={s.tableWrap}>
        <table className={s.table}>
          <tbody>
            {rows.map((row, r) => (
              <tr key={r}>
                {row.map((cellValue, c) => {
                  const Tag = r === 0 ? 'th' : 'td';
                  return (
                    <Tag
                      key={c}
                      className={s.cell}
                      data-head={r === 0 ? 'true' : undefined}
                      style={{ textAlign: alignToCss(align[c] ?? null) }}
                    >
                      {cellValue}
                    </Tag>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className={s.tableWrap}>
      <table className={s.table}>
        <tbody>
          <tr>
            {rows[0]?.map((_, c) => (
              <td key={c} className={s.gutterCell}>
                <div className={s.alignBar}>
                  {ALIGNS.map((a) => (
                    <button
                      key={a}
                      type="button"
                      className={s.alignBtn}
                      data-active={(align[c] ?? 'left') === a ? 'true' : undefined}
                      title={`Выравнивание колонки ${c + 1}`}
                      aria-label={`Выравнивание колонки ${c + 1}: ${a}`}
                      onClick={() => setAlign(c, a)}
                    >
                      {icons[`align_${a}`]}
                    </button>
                  ))}
                </div>
              </td>
            ))}
            <td className={s.gutterCell} />
          </tr>
          {rows.map((row, r) => (
            <tr key={r}>
              {row.map((cellValue, c) => (
                <td
                  key={c}
                  className={s.cell}
                  data-head={r === 0 ? 'true' : undefined}
                  style={{ textAlign: alignToCss(align[c] ?? null) }}
                >
                  <input
                    className={s.cellInput}
                    value={cellValue}
                    aria-label={r === 0 ? `Заголовок колонки ${c + 1}` : `Строка ${r}, колонка ${c + 1}`}
                    placeholder={r === 0 ? 'заголовок' : ''}
                    onChange={(e) => {
                      const v = e.target.value;
                      setRows((prev) =>
                        prev.map((pr, i) =>
                          i === r ? pr.map((pc, j) => (j === c ? v : pc)) : pr,
                        ),
                      );
                    }}
                    onPaste={(e) => handlePaste(e, r, c)}
                    onBlur={() => p.onUpdate({ rows })}
                  />
                </td>
              ))}
              <td className={s.gutterCell}>
                {rows.length > 1 && (
                  <button
                    type="button"
                    className={s.iconButton}
                    title="Удалить строку"
                    aria-label="Удалить строку"
                    onClick={() => delRow(r)}
                  >
                    {icons.close}
                  </button>
                )}
              </td>
            </tr>
          ))}
          {width > 1 && (
            <tr>
              {rows[0]?.map((_, c) => (
                <td key={c} className={s.gutterCell}>
                  <button
                    type="button"
                    className={s.iconButton}
                    title={`Удалить колонку ${c + 1}`}
                    aria-label={`Удалить колонку ${c + 1}`}
                    onClick={() => delCol(c)}
                  >
                    {icons.close}
                  </button>
                </td>
              ))}
              <td className={s.gutterCell} />
            </tr>
          )}
        </tbody>
      </table>
      <div className={s.tableTools}>
        <button type="button" className={s.ghostButton} title="Добавить строку" onClick={addRow}>
          {icons.plus} строка
        </button>
        <button type="button" className={s.ghostButton} title="Добавить колонку" onClick={addCol}>
          {icons.plus} колонка
        </button>
      </div>
    </div>
  );
});
