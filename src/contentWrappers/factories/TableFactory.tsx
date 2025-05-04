import React from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table';

import { AliasedField, ContentAdapterProps, ContentBlockProps, PageConfig } from '../types';
import { useContext, useMemo } from 'react';
import { MRT_ActionMenuItem, MRT_Row, MRT_TableInstance } from 'material-react-table';
import { generateContentApapterComponent } from '../utils';
import { useActions } from '../../components/ActionsList/utils';


export const useMRTAccessor = (fieldsToShow: AliasedField[]) => {
  return useMemo<MRT_ColumnDef<any>[]>(() => {
    return fieldsToShow.map(({ alias, fieldName, component }) => {
      let accessor: MRT_ColumnDef<any> = {
        accessorKey: fieldName,
        header: alias,
      };

      if (component) {
        accessor.Cell = component;
      }

      return accessor;
    });
  }, [fieldsToShow]);
};


export const useRowActionMenuItems = (page: PageConfig, injectionValues?: any) => {
  const actions = useActions(page.rowActions);

  // Возвращаем функцию для создания элементов меню
  return ({ row, table }: { row: MRT_Row<any>; table: MRT_TableInstance<any> }) => {
    // @ts-ignore
    return actions.map((ActionWrapper, index) => {
        const actionPayload = page.rowActions[index];
        return (
          <div key={actionPayload.label || actionPayload.operationId || 'action'}>
            <ActionWrapper injectionValues={{row, table, previousInjectionValues: injectionValues }}>
              <MRT_ActionMenuItem
                key={actionPayload.label || actionPayload.operationId || 'action'}
                icon={actionPayload.icon}
                label={actionPayload.label || actionPayload.operationId || 'action'}
                table={table}
              />
            </ActionWrapper>
          </div>
        );
    })

    }
  }


type TableNestedContentProps = {
  row: MRT_Row<any>;
  table: MRT_TableInstance<any>;
};

const TableNestedContentWrapper = (pageConfig: PageConfig, injectionValues?: any) => {
  console.log("TableNestedContentWrapper", injectionValues)
  const TableNestedContent: React.FC<TableNestedContentProps> = ({row, table}) => {
    const NestedComponent = React.useMemo(() => {
        const Component =  generateContentApapterComponent(pageConfig).Component;
        return <Component injectionValues={{row, table, previousInjectionValues: injectionValues}}/>
    }, []);
    // const {Component} = generateContentApapterComponent(pageConfig);
    return NestedComponent
    // return <div>hello</div>
  }
  return TableNestedContent;
}


const useTable = (props: ContentBlockProps = {}) => {
  const columns = useMRTAccessor(props.vizualizationConfig.fieldsToShow); // Генерация колонок
  const getRowActionMenuItems = useRowActionMenuItems(props, props.injectionValues); // Функция-генератор элементов меню

  // @ts-ignore
  const [state, setState] = useRecoilState(props.portDataAtom);

  const table = useMaterialReactTable({
    columns,
    // @ts-ignore
    data: state,
    enableRowActions: true,
    rowCount: 1000,
    state: {
      isLoading: props.isLoading,
      pagination: props.pagination,
      globalFilter: props.globalFilter,
    },
    initialState: {
      columnVisibility: !Boolean(props.rowActions)
        ? { 'mrt-row-actions': false }
        : undefined,
    },
    enableGlobalFilter: false,
    manualPagination: true,
    onPaginationChange: props.setPagination,
    enableTopToolbar: Boolean(props.vizualizationConfig.enableTopToolbar),
    enablePagination: typeof props.filterAction.usePagination === 'undefined'
      ? true
      : props.filterAction.usePagination,
    enableRowSelection: typeof props.vizualizationConfig.useSelection === 'undefined'
      ? true
      : props.vizualizationConfig.useSelection,
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        minHeight: Boolean(props.vizualizationConfig.withMinHeight)
          ? window.innerHeight - 140
          : null,
      },
    },
    renderRowActionMenuItems: ({ row, table }) =>
      getRowActionMenuItems({ row, table }), // Используем функцию-генератор
    enableExpanding: Boolean(props.nestedDataConfig),
    renderDetailPanel: props.nestedDataConfig
      ? TableNestedContentWrapper(props.nestedDataConfig, props.injectionValues)
      : undefined,
  });

  const TableComponent = (
    <div style={{ width: '100%' }}>
      <MaterialReactTable table={table} />
    </div>
  );

  return {TableComponent};
};


export default useTable;