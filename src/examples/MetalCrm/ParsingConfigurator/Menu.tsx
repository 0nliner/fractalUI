// @ts-nocheck
import * as XLSX from 'xlsx';

import React, { useContext, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import 'react-datasheet-grid/dist/style.css'

import { Button, Stack, TextField, Skeleton, Paper, List } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';

import { useLocation } from 'react-router-dom';

import { ParsingConfiguratorContext } from '.';
import { SectionEditor } from './SectionEditor';
// import { PageContexMenu } from 'PageContexMenu';

// import { AutocompleteFormField } from '../../../autoforms/AutocompleteField';
import "./style.css";
import { createNewSection, setSections } from '../redux/actions';
import { createParsingConfiguration, preprocessFile, searchVendors, updateParsingConfiguration } from '../../../../api_client/sdk.gen';
import ReactDOM from 'react-dom';


// ЛЕГАСИ
import { filterByPropertyValue } from '../api_client/sdk.gen';


export default function AutcompleteFormField(
  {method, label, getOptionLabel, inputValue, setInputValue, style, initialOptions}) {
  
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState(initialOptions?initialOptions:[]);
  const [loading, setLoading] = useState(false);

  if (getOptionLabel === undefined) {
    getOptionLabel = (option) => option
  }

  useEffect(() => {
    let active = true;

    if (inputValue === '') {
      setOptions([]);
      return undefined;
    }

    setLoading(true);

    // Функция для отправки запроса на сервер
    const fetchData = async () => {
      if (active) {
        const response = await method(inputValue, setOptions)
        // console.log(response);
        setLoading(false)
      }
    }

    fetchData();

    return () => {
      active = false;
    };
  }, [inputValue]);
  // console.log("default value is", inputValue);
  return (
    <Autocomplete
      open={open}
      style={style}
      size="small"
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      onInputChange={(event, value) => setInputValue(value)}
      getOptionLabel={getOptionLabel}
      options={options}
      loading={loading}
      defaultValue={initialOptions?initialOptions:[]}
      renderInput={(params) => (
        <TextField
          size="small"
          {...params}
          label={label}
          defaultValue={inputValue}
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
}




const FloatingMenu = () => {
    // const {notifications_provider} = useContext(appContext);
    const dispatch = useDispatch();
    const sections = useSelector((state) => state.selection.sections);
    const [errorMessages, setErrorMessages] = useState([]);
    const prevErrorMessages = React.useRef(errorMessages);
    
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const priceListId = Number(queryParams.get("price_list_id"));

    const {
      activeSheet,
      setActiveSheet,
      uploadedFile,
      setUploadedFile,
      setWorkbook,
      setSheetNames,
      loadSheetData,
      vendor, setVendor,
      documentTitle, setDocumentTitle,
      isPageLoading,
      isEditingNorNewConfig, setIsEditingNorNewConfig
      } = React.useContext(ParsingConfiguratorContext);

    const [editing, setEditing] = React.useState<boolean>(isEditingNorNewConfig);
    const [configurationId, setConfigurationId] = React.useState<number>();

    const setPriceList = (price_list_id: number) => {
      // window.location = `${wind ow.location}_?price_list_id=${price_list_id}`
      setEditing(true)
      setConfigurationId(price_list_id)
    }

    const handleFileUpload = async (event) => {
      const file = event.target.files[0];
      const response = await preprocessFile({body: {file_to_process: file}});
      const filename = response.headers.get("filename");
      const preprocessed_file = new File([response.data], filename);
      setUploadedFile(preprocessed_file);
      if (preprocessed_file) {
        // Чтение файла как бинарный стрим
        // TODO: вынести эту логику в сервис работы с файлами
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = e.target.result;
          // Парсинг Excel-файла
          const workbook = XLSX.read(data, { type: 'binary' });
          setWorkbook(workbook);
          setSheetNames(workbook.SheetNames);
          setActiveSheet(workbook.SheetNames[0]);
          loadSheetData(workbook, workbook.SheetNames[0]);
        };
        reader.readAsArrayBuffer(preprocessed_file);
      }}

    const onConfirmEditing = async () => {
      const payload = {
        title: documentTitle,
        vendor: vendor,
        sections: sections};

      if (editing) {
        await updateParsingConfiguration({query: {price_list_id: priceListId}, body: {configuration: JSON.stringify(payload)}});
      }
      else if (isPageLoading === false) {
        const response = await createParsingConfiguration({body: {file: uploadedFile, vendor: payload.vendor, title: payload.title, sections: payload.sections}});
        setPriceList(response.data.id)
      }
    }

    if (isPageLoading) {
      return (
        // ReactDOM.createPortal(
          <Paper>
            <Stack spacing={2}>
              <Skeleton variant="rectangular" width={"100%"} height={118}/>
              <Skeleton variant="rectangular" width={"100%"} height={118}/>
              <Skeleton variant="rectangular" width={"100%"} height={118}/>
            </Stack>
          </Paper>
          // , document.getElementById("pageContextMenuPortalRoot")!
        // )
        )
    }
    else {
      return (
        <Paper style={{height: window.innerHeight - 88, padding: "20px 10px"}}>
          <Stack spacing={1} direction="column">
            <TextField size="small" onChange={(e)=>{setDocumentTitle(e.target.value)}} label="наименование документа" variant="outlined" defaultValue={documentTitle}/>
            {/* ПРОКЛЯТОЕ МЕСТО, НУЖНО ЭТОТ АВТОКОМПЛИТ СДЕЛАТЬ ЧЕЛОВЕЧЕСКИМ */}
            <AutcompleteFormField
              method={async (substring, setOptions) => await searchVendors({query: {substring}}).then(response => setOptions(response.data))}
              label='Вендор'
              property_type="vendor"
              getOptionLabel={(option) => {return option ? option.title : ""}}
              initialOptions={editing?{id: 1, title: vendor, label: vendor}: undefined}
              inputValue={editing?{id: 1, title: vendor, label: vendor}: undefined}
              setInputValue={setVendor}
              />
            <div className='input-file'>
              <input
                type="file"
                onChange={handleFileUpload}
                className='input-file'
                accept='.xlsx, .xls'/>
            </div>
            <List style={{overflow: "scroll"}}>
              {sections.map((section)=>(<SectionEditor key={section.id} index={section.index} title_={section.title} section_={section}/>))}
            </List>
            <Button size="small" variant="contained" onClick={(e)=>dispatch(createNewSection({sheet: activeSheet}))}>Добавить новую секцию</Button>
            <Button size="small" variant="contained" onClick={(e)=>onConfirmEditing()}>Сохранить конфигурацию</Button>
          </Stack>  
        </Paper>
      );
    }
  };

export {FloatingMenu};
