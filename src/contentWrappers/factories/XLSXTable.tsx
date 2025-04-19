import React from "react";
import { ContentAdapterProps, PageConfig } from "../types";
import {
  DataSheetGrid,
  checkboxColumn,
  textColumn,
  keyColumn,
} from 'react-datasheet-grid'
import "./xlsx.css";

// Import the style only once in your app!
import 'react-datasheet-grid/dist/style.css'

const cols_aliases = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];


const AutoXlsxTable: React.FC<ContentAdapterProps> = (props) => {
  const tableRef = React.useRef<typeof DataSheetGrid>(null);
  const columns = [
    {
        ...keyColumn("menu_alias", textColumn),
        title: "тип питания",
    },
    {
        ...keyColumn("meal_alias", textColumn),
        title: "Тип приёма пищи",
    },
    {
        ...keyColumn("entrance_datetime", textColumn),
        title: "Дата входа",
    },
    {
        ...keyColumn("first_name", textColumn),
        title: "Имя",
    },
    {
        ...keyColumn("second_name", textColumn),
        title: "Отчество",
    },
    {
        ...keyColumn("last_name", textColumn),
        title: "Фамилия",
    },
    {
        ...keyColumn("is_allowed", checkboxColumn),
        title: "Разрешено ли",
    }]

  // @ts-ignore
  const {formOpened, setFormOpened, currentForm, setCurrentForm, 
       pagination, setPagination, objects, setObjects,
       globalFilter, setGlobalFilter, isLoading, setIsLoading,
       isRefetching, setIsRefetching} = props;
  

    return (
      <div className="tableWrapper">
        <DataSheetGrid
            // @ts-ignore
            ref={tableRef}
            style={{overflowX: "scroll", height: "inherit", scrollbarWidth: "none"}}
            value={objects}
            addRowsComponent={false}
            // contextMenuComponent={ContextMenu}
            // onSelectionChange={(selection)=>{setCurrentSelection(selection.selection)}}
            columns={columns}/>
    </div>
    );
} 


function createXlsxTableFactory(page: PageConfig) {
    return {
      // здесь можно вернуть всё, что нужно для "XLSXTable"-визуализации
      Component: (props) => <AutoXlsxTable {...props}/>,
      extraProps: { fieldsToShow: page.vizualizationConfig.fieldsToShow }
    };
  }
  
  export default createXlsxTableFactory;
