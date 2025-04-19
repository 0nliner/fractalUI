// @ts-nocheck
import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import {
  DataSheetGrid,
  textColumn,
  keyColumn,
} from 'react-datasheet-grid'

import 'react-datasheet-grid/dist/style.css'
import './style.css'
import { Stack } from '@mui/material';

import { ContextMenu } from './TableContextMenu';
import { FloatingMenu } from './Menu';

import { useLocation } from 'react-router-dom';
// import { appContext } from '..';
import { useDispatch } from 'react-redux';
import { setSections, resetSections } from '../redux/actions';
// @ts-ignore
import { getParsingConfiguration } from '../../../../api_client/sdk.gen';
import { downloadMinioFile } from '../../../autoforms/utils';

const cols_aliases = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];



const ParsingConfiguratorContext = React.createContext({
  tableRef: null
})



const ParsingConfigurator = () => {
  const tableRef = React.useRef(null);
  const dispatch = useDispatch();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const priceListId = Number(queryParams.get("price_list_id"));
  const [isPageLoading, setIsPageLoading] = React.useState(priceListId?true:false);
  const [isEditingNorNewConfig, setIsEditingNorNewConfig] = React.useState(priceListId?true:false);

  const [activeSection, setActiveSection] = React.useState(null);
  const [currentSelection, setCurrentSelection] = React.useState(null);
  const [selectionFrom, setSelectionFrom] = React.useState(null);
  const [selectionTo, setSelectionTo] = React.useState(null);

  const [workbook, setWorkbook] = React.useState(null);
  const [sheetNames, setSheetNames] = React.useState([]);
  const [activeSheet, setActiveSheet] = React.useState('');
  const [vendor, setVendor] = React.useState(null);
  const [documentTitle, setDocumentTitle] = React.useState();
  const [uploadedFile, setUploadedFile] = React.useState(null);

  const columns = cols_aliases.map((title, index)=>{return {...keyColumn(title, textColumn), "title": title }});
  const [rows, setRows] = React.useState([]);

  const loadSheetData = (workbook, sheetName) => {
    const worksheet = workbook.Sheets[sheetName];
    // Преобразование листа в массив массивов
    const sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }, {defval:""});
    if (sheetData.length === 0) {
      setRows([]);
      return;
    }

    const dataRows = prepareData(sheetData);
    setRows(dataRows);
    };

  const prepareData = (sheet) => {
      const currentDataRows = [];
      sheet.forEach((row, rowIndex) => {
        const rowToAdd = {};
        cols_aliases.forEach((column, index) => {
          const cellOfRow = String((row.length >= index) ? (row[index] ?? "") : "");
          rowToAdd[column] = cellOfRow;
        });
        currentDataRows.push(rowToAdd);
      });
      return currentDataRows;
    };

  const contextValue = {tableRef,
                        activeSection, setActiveSection, 
                        activeSheet, setActiveSheet,
                        currentSelection, setCurrentSelection,
                        workbook, setWorkbook,
                        rows, setRows,
                        sheetNames, setSheetNames,
                        uploadedFile, setUploadedFile,
                        loadSheetData, prepareData,
                        vendor, setVendor,
                        documentTitle, setDocumentTitle,
                        isPageLoading, isEditingNorNewConfig, setIsEditingNorNewConfig,
                        priceListId,
                        selectionFrom, setSelectionFrom,
                        selectionTo, setSelectionTo
                      };
  // console.log("vendor value", vendor);
  const handleSheetChange = ({sheetName}) => {
    setActiveSheet(sheetName);
    loadSheetData(workbook, sheetName);
  };

  React.useEffect(() => {
    dispatch(resetSections([]));
    document.addEventListener('contextmenu', (event) => event.preventDefault());
    if (priceListId) {
      const loadConfigurationFromServer = async () => {
        const response = await getParsingConfiguration({query: {price_list_id: priceListId}});
        if (response.data) {
          const file = await downloadMinioFile(response.data.file_url)
          let configuration_dump = JSON.parse(response.data.configuration);
          if (typeof configuration_dump === typeof "") {
            configuration_dump = JSON.parse(configuration_dump)
          }
          const priceListTitle = response.data.price_list_title;
          // console.log(configuration_dump);

          setUploadedFile(file);
          const reader = new FileReader();
          reader.onload = (e) => {
            // Парсинг Excel-файла
            const data = e.target.result;
            const workbook_ = XLSX.read(data, { type: 'binary' });
            setWorkbook(workbook_);
            setSheetNames(workbook_.SheetNames);
            setActiveSheet(workbook_.SheetNames[0]);
            loadSheetData(workbook_, workbook_.SheetNames[0]);
          };
          reader.readAsArrayBuffer(file);

          setVendor(configuration_dump.vendor);
          setDocumentTitle(priceListTitle);
          dispatch(setSections(configuration_dump));
        }
        else {
          console.log("problem with loading data from server")
        } 
        setIsPageLoading(false);
      }
      loadConfigurationFromServer();
    }
  }, []);

  return (
    <ParsingConfiguratorContext.Provider value={contextValue}>
      <div style={{display: "flex"}}>
        <div id="tableWrapper">
            <DataSheetGrid
                ref={tableRef}
                style={{overflowX: "scroll"}}
                value={rows}
                addRowsComponent={false}
                contextMenuComponent={ContextMenu}
                onSelectionChange={(selection)=>{setCurrentSelection(selection.selection)}}
                columns={columns}/>
            <Stack direction="row"
                    spacing={2}
                    style={{backgroundColor: "#161616",
                            borderRadius: 100,
                            padding: 5,
                            height: "30px",
                            scrollbarWidth: "none",
                            marginTop: 7,
                            overflowX: "scroll"}}>
                {sheetNames.map((name) => (
                  <div className='sheetOption'
                        onClick={()=>handleSheetChange({sheetName: name})}
                        style={activeSheet===name? {color: '#1976d2', borderColor: '#1976d2'}: {}}
                        key={name}
                        value={name}>
                        {name}
                  </div>
                ))}
            </Stack>
        </div>
        <FloatingMenu/>
      </div>
    </ParsingConfiguratorContext.Provider>
  );
}


export {ParsingConfigurator, ParsingConfiguratorContext};
