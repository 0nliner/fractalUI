import { useEffect, useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type RowSelectionState,
} from '@tanstack/react-table';
import * as s from './AutoTable.css';
import type { AutoTableProps } from './types';

/**
 * Schema-driven таблица на TanStack Table (headless) + токенах fractalUI.
 * Данные и колбэки — через props. Без сети и стора (это уровень runtime).
 */
export function AutoTable<T>(props: AutoTableProps<T>) {
  const {
    columns: cols,
    data,
    enableSelection,
    onSelectionChange,
    onRowClick,
    getRowId,
    emptyMessage = 'Нет данных',
  } = props;

  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const columns = useMemo<ColumnDef<T>[]>(
    () =>
      cols.map((c) => ({
        id: c.key,
        accessorFn: (row: T) => (row as Record<string, unknown>)[c.key],
        header: c.header,
        enableSorting: c.sortable ?? true,
        cell: c.cell
          ? (ctx) => c.cell!(ctx.row.original)
          : (ctx) => {
              const v = ctx.getValue();
              return v == null ? '' : String(v);
            },
      })),
    [cols],
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting, rowSelection },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    enableRowSelection: enableSelection ?? false,
    getRowId: getRowId ? (row) => getRowId(row) : undefined,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  useEffect(() => {
    onSelectionChange?.(Object.keys(rowSelection).filter((k) => rowSelection[k]));
  }, [rowSelection, onSelectionChange]);

  const colSpan = columns.length + (enableSelection ? 1 : 0);

  return (
    <div className={s.wrapper}>
      <table className={s.table}>
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {enableSelection ? (
                <th className={`${s.th} ${s.checkboxCell}`}>
                  <input
                    type="checkbox"
                    checked={table.getIsAllRowsSelected()}
                    onChange={table.getToggleAllRowsSelectedHandler()}
                    aria-label="Выбрать все"
                  />
                </th>
              ) : null}
              {hg.headers.map((header) => {
                const canSort = header.column.getCanSort();
                const sorted = header.column.getIsSorted();
                return (
                  <th
                    key={header.id}
                    className={`${s.th} ${canSort ? s.thSortable : ''}`}
                    onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {sorted ? <span className={s.sortIcon}>{sorted === 'asc' ? '↑' : '↓'}</span> : null}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.length === 0 ? (
            <tr>
              <td className={s.empty} colSpan={colSpan}>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((r) => (
              <tr
                key={r.id}
                className={`${s.row} ${onRowClick ? s.rowClickable : ''}`}
                onClick={onRowClick ? () => onRowClick(r.original) : undefined}
              >
                {enableSelection ? (
                  <td className={`${s.td} ${s.checkboxCell}`} onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={r.getIsSelected()}
                      onChange={r.getToggleSelectedHandler()}
                      aria-label="Выбрать строку"
                    />
                  </td>
                ) : null}
                {r.getVisibleCells().map((cell) => (
                  <td key={cell.id} className={s.td}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
