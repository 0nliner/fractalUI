// @ts-nocheck
import React, { useContext, useRef, useState } from 'react';
import {  useDispatch, useSelector } from 'react-redux';

import 'react-datasheet-grid/dist/style.css'
import './style.css'
import { changeSection, deleteSection, addColumn } from '../redux/actions'; 

import { Button, TextField, Stack, Collapse, Paper, Select } from '@mui/material';
import { List, ListItem, ListItemText, MenuItem, Menu, IconButton } from '@mui/material';
import {
  DataSheetGrid,
  textColumn,
  keyColumn,
} from 'react-datasheet-grid'
import { FloatingWidget } from '../../../components/FloatingWidget';
// import Textarea from '@mui/joy/Textarea';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import { ParsingConfiguratorContext } from '.';
import { Column } from './Column';


const zip = (...arrays) => {
  const length = Math.min(...arrays.map(arr => arr.length));
  const result = [];
  
  for (let i = 0; i < length; i++) {
      const zipped = arrays.map(arr => arr[i]);
      result.push(zipped);
  }
  
  return result;
};


const SectionEditor = ({index, title_, section_}) => {
    const dispatch = useDispatch();
    const {activeSection, currentSelection, activeSheet, setActiveSheet, sheetNames} = useContext(ParsingConfiguratorContext)
    const {tableRef, setActiveSection} = useContext(ParsingConfiguratorContext);
    const isActive = activeSection === index;
    
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [title, setTitle] = useState(title_); 
    // const [description, setDescription] = useState(section_?.description?section_.description:"");
    const [sheet, setSheet] = useState(activeSheet?activeSheet:section_.sheet);
  
    const section = useSelector(state=>state.selection.sections.filter(section__=>section__.id===section_.id))[0];
    const columns = section.columns;
    const columnsRefs = useRef([]);

    // показ предварительно подготовленных данных 
    const [showPreparedData, setShowPreparedData] = useState(false);
    const [preparedData, setPreparedData] = React.useState([]);
    const [sheetColumns, setSheetColumns] = useState([]);

    // контекстное меню
    const [anchorEl, setAnchorEl] = React.useState(null);
    const isContextOpened = Boolean(anchorEl);
    const handleClickContextMenu = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleCloseContextMenu = () => {
      setAnchorEl(null);
    };
  
    const showDataAfterParsing = (e) => {
      const columnsToPresent = section.columns.map(col=>col.productAttributeName);
      const extractedData = Object.entries(columnsRefs).map(
        (col, ind) => {
          if (col[1].collectDataAfterParsing) {
            const  data = col[1].collectDataAfterParsing(null);
            return data;
          }
        });
      const prepareData = zip(...extractedData);
      console.log('prepared', prepareData);
      // [{...keyColumn(alias, textColumn), "title": productAttributeName }]
      setPreparedData(prepareData);
      setShowPreparedData(true);
      setSheetColumns(columnsToPresent);
    }


    const availableActions = [
      {label: 'установить секцию как активную', onClick: (e) => {(setActiveSection(index))}},
      {label: 'выделить секцию', onClick: (e) => {tableRef?.current?.setSelection(section.selection)}},
      {label: 'удалить секцию', onClick: (e) => {dispatch(deleteSection(section_.id))}},
      {label: 'показать подготовленные данные', onClick: showDataAfterParsing}
    ];


    const sectionPayload = {
      title: title,
      // description: description,
      sheet: sheet,
      preparedData: preparedData,
    }
    
    return (
      <>
        {showPreparedData?(
        <FloatingWidget onClose={(e)=>setShowPreparedData(false)} widgetTitle={`Подготовленные данные по ${section.title}`}>
          <DataSheetGrid
            style={{overflowX: "scroll"}}
            value={preparedData}
            addRowsComponent={false}
            columns={sheetColumns}/>
        </FloatingWidget>
        ): undefined
        }
        <ListItem button >
          <ListItemText onClick={() => setIsCollapsed(!isCollapsed)} primary={`${sheet} > ${title}`} />
          {/* контекстное меню */}
          <div>
            <IconButton
              aria-label="more"
              id={`long-button-${index}`}
              aria-controls={isContextOpened ? `long-button-${index}` : undefined}
              aria-expanded={isContextOpened ? 'true' : undefined}
              aria-haspopup="true"
              onClick={handleClickContextMenu}>
              <MoreVertIcon/>
            </IconButton>
            <Menu
              id={`long-menu-${index}`}
              MenuListProps={{
                'aria-labelledby': `long-button-${index}`,
              }}
              anchorEl={anchorEl}
              open={isContextOpened}
              onClose={handleCloseContextMenu}
              slotProps={{
                paper: {
                  style: {
                    maxHeight: 48 * 4.5,
                    width: '20ch',
                  },
                },
              }}
            >
              {availableActions.map(({label, onClick}) => (
                <MenuItem key={label}
                          size="small"
                          style={{fontSize: 10}}
                          onClick={(e)=>{handleCloseContextMenu(); onClick()}}>
                  {label}
                </MenuItem>
              ))}
            </Menu>
          </div>
        </ListItem>
        <Collapse in={isCollapsed} style={{padding: 5}}>
          <Paper style={{paddingTop: 10}}>
          <div style={{display: "flex",
                      flexDirection: "column",
                      borderRadius: 15,
                      boxShadow: isActive ? '0 0 10px rgba(173, 216, 230, 0.5)' : undefined,
                      gap: 5,
                      margin: 15
                      }}
              className="sectionEditor">
              <TextField size='small'
                         onChange={e=>{
                          // console.log('newTitleIs', e.target.value);
                                       setTitle(e.target.value)}}
                         label="Название секции"
                         value={title}
                         variant="outlined">{title}</TextField>
              <Select
                labelId="sheet-selection"
                value={sheet}
                label="Рабочий лист"
                size='small'
                onChange={e=>setSheet(e.target.value)}
                // onChange={(e) => setMealTypeFilter(e.target.value)}
              >
                {sheetNames.map((sheetName, index) => (
                  <MenuItem key={index} value={sheetName}>
                    {sheetName}
                  </MenuItem>
                ))}
              </Select>
              {/* <TextField size='small' onChange={e=>setSheet(e.title.value)} label="Лист" variant="outlined" value={section.sheet}/> */}
              {/* <TextField placeholder='Комментарий' size='small' onChange={e=>setDescription(e.target.value)} value={description}/> */}
              <Stack direction="row" spacing={1}>
                <Button size='small' onClick={(e)=>{dispatch(changeSection(section_.id, sectionPayload))}}>сохранить изменения</Button>
              </Stack>
  
              <List
                sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
                component="div"
                aria-labelledby="nested-list-subheader">
                  <div id="nested-list-subheader" style={{lineHeight: null, textAlign: "left", marginTop: 20, marginBottom: 20, marginLeft: "10px"}}>
                    <b>
                    Параметры парсинга секции
                    </b>
                  </div>
  
                  {columns.map((column, colIndex)=>{console.log('key', `${section_.id}-${column.id}`);
                    return (<Column ref={el=>{(columnsRefs[colIndex] = el)}} key={`${section_.id}-${column.id}`} sectionId={section_.id} column={column}/>);})}
                <Button size='small' onClick={(e)=>{dispatch(addColumn(section_.id, {}))}}>добавить колонку</Button>
              </List>
  
          </div>
          </Paper>
        </Collapse>
      </>
    );
  }

export {SectionEditor};