// @ts-nocheck
import React, { useRef, useState, useImperativeHandle } from 'react';
import { useDispatch } from 'react-redux';

import {
  DataSheetGrid,
  textColumn,
  keyColumn,
} from 'react-datasheet-grid'

import './style.css'

import { changeColumn, deleteColumn } from '../redux/actions';
import Checkbox from '@mui/material/Checkbox';
import { Button, TextField, Stack, Autocomplete, FilledInput, Collapse } from '@mui/material';
import { ListItem, ListItemText, MenuItem, Menu, IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import { getAlphabetIndex } from '../redux/reducers/SelectionStates';

import { ParsingConfiguratorContext } from '.';
import { FloatingWidget } from '../../../components/FloatingWidget';


const product_alias_variants = {
  'Тип объекта': {alias: "type"},
  'марка металла': {alias: "steel_mark"},
  'цена': {alias: "price"},
  'кол-во': {alias: "quantity"},

  'ширина': {alias: "width", useUnitsOfMeasurement: true},
  'длина': {alias: "length", useUnitsOfMeasurement: true},
  'высота': {alias: "height", useUnitsOfMeasurement: true},
  'толщина': {alias: "thickness", useUnitsOfMeasurement: true},
  'диаметр': {alias: "diameter", useUnitsOfMeasurement: true},
};


const mesermentUnits = [
  'мм', 'м', 'см'
]

// React.forwardRef(
const Column = React.forwardRef(({sectionId, column}, ref) => {
    const dispatch = useDispatch();
    // в данном случае index так же равен colId
    const index = column.index;
    
    const localRef = useRef();

    const [alias, setAlias] = React.useState(column.alias);
    const [productAttributeName, setProductAttributeName] = React.useState(column.productAttributeName);
    const [measurmentUnit, setUsedMesermentUnit] = React.useState(column.usedMesermentUnit);
    const [fieldType, setFieldType] = React.useState(column.field_type);
    const [start, setStart] = React.useState(column.start);
    const [end, setEnd] = React.useState(column.end);
    const [isHardcoded, setIsHardcoded] = React.useState(Boolean(column.isHardcoded));
    const [hardcodedValue, setHardcodedValue] = React.useState(column.hardcodedValue);
    const [preparedData, setPreparedData] = React.useState(column.preparedData);
    const [regularExpression, setRegularExpression] = useState(column.regularExpression);

    const {tableRef, rows} = React.useContext(ParsingConfiguratorContext);
    const [isEditing, setIsEditing] = React.useState(false);
    const [isCollapsed, setIsCollapsed] = React.useState(false);

    // показ предварительно подготовленных данных 
    const [showPreparedData, setShowPreparedData] = React.useState(false);

    const confirmEditing = () => {
      dispatch(changeColumn({sectionId:sectionId, colId: column.id, payload:payload}));
      setIsEditing(false);
    } 
  
    const showSelection = (e) => {
      let colIndex = getAlphabetIndex(column.alias)
      const selection = {
        min: {
          col: colIndex,
          row: start - 1,
          colId: alias
        },
        max: {
          col: colIndex,
          row: end - 1,
          colId: alias},
      };
      tableRef?.current?.setSelection(selection);
    }


    const collectDataAfterParsing = (e) => {
        let regexToUse = null;
        let isNumRange = false;

        let containsDiaposonGroups = false; 
        let containsMatchGroup = false; 

        if (regularExpression) {
          containsDiaposonGroups = regularExpression.includes("?<start>") & regularExpression.includes("?<end>")
          containsMatchGroup = regularExpression.includes("?<match>");

          if (containsMatchGroup & !containsDiaposonGroups) {
              regexToUse = regularExpression;
          }
          else if (containsDiaposonGroups) {
            regexToUse = regularExpression;
            isNumRange = true;
          }
          else {
              regexToUse = `(?<match>${regularExpression})`
          }
        }

        const selectedRows = rows.slice(start-1, end);
        const selectedData = selectedRows.map(object=>{
            const rawData = object[alias];
            if (Boolean(regexToUse) & !isNumRange) {
                const regex = new RegExp(regexToUse);
                const match = rawData.match(regex);
                if (match && match.groups === undefined) {
                  return "ERR"
                }
                return (match?match.groups.match:match);
            }
            else if (Boolean(regexToUse) & isNumRange) {
              let preparedValue = null;
              const regex = new RegExp(regexToUse);
              const match = rawData.match(regex);
              if (match && match.groups === undefined) {
                return "ERR"
              }
              else if (Boolean(match.groups.start) & Boolean(match.groups.end)) {
                return (match?`От ${match.groups.start} до ${match.groups.end}`:match);
              }
              else if (containsMatchGroup) {
                if (match && match.groups === undefined) {
                  return "ERR"
                }
                return (match?match.groups.match:match);
              }
            }
            else {
                return (rawData);
            }
            })
        return selectedData;
    }

    const showDataAfterParsing = (e) => {
      const preparedData_ = collectDataAfterParsing();
      setPreparedData(preparedData_);
      dispatch(changeColumn({sectionId: sectionId, colId: column.id, payload: {preparedData: preparedData_}}))
      // console.log("selectedData", preparedData);
      setShowPreparedData(true)
    }

    useImperativeHandle(ref, ()=>({productAttributeName: productAttributeName, collectDataAfterParsing: collectDataAfterParsing}));

    // контекстное меню  
    const [anchorEl, setAnchorEl] = React.useState(null);
    const isContextOpened = Boolean(anchorEl);
    const handleClickContextMenu = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleCloseContextMenu = () => {
      setAnchorEl(null);
    };
  
    const availableActions = [
        {label: 'редактировать', onClick: (e)=>{setIsEditing(true); setIsCollapsed(true)}},
        {label: 'показать колонку', onClick: showSelection},
        {label: 'показать данные в обработке', onClick: showDataAfterParsing},
        {label: 'удалить колонку', onClick: (e) => {dispatch(deleteColumn({sectionId: sectionId, colId: column.id}))}}
        // TODO:
        // {label: 'установить секцию как активную', onClick: (e) => {(setActiveSection(index))}},
        // {label: 'выделить секцию', onClick: (e) => {tableRef?.current?.setSelection(section.selection)}},
    ];
    // конец контекстного меню
    
    const payload = {
      alias,
      productAttributeName,
      fieldType,
      start,
      end,
      isHardcoded,
      hardcodedValue,
      regularExpression,
      preparedData,
      measurmentUnit
    };
  
    const hardcodedValueFieldRef = React.useRef();
    const sheetAliasFieldRef = React.useRef();
    const isHardcodedHandler = (e) => {
      // если до переключения чекбокса hardcoded значение установлено, нужно его заменить на undefined, 
      // чтобы эта лабуда случ. не была учтена при парсинге, когда флаг выключен
      if (isHardcoded) {
        // переключаем значение с hardcoded на alias
        setHardcodedValue(undefined);
        setIsHardcoded(false);
      }
      else if (isHardcoded === false) {
        // переключаемся с alias на хардкод значение
        setIsHardcoded(true);
        setAlias(undefined);
        setHardcodedValue(undefined);
      }
    };
  
    let elementContent = null
    if (isEditing) {
      elementContent = (
        <Stack direction="column" spacing={1}>
          <Stack direction={"row"}>
            <Checkbox size="small" onChange={isHardcodedHandler} checked={isHardcoded} inputProps={{ 'aria-label': 'isHardcoded' }}/>
            <div style={{fontSize: "10px", textAlign: "left"}}>Использовать принудительно указанное значение ?</div> 
          </Stack>
          {isHardcoded?
            (<>
              <span>Принудительное значение</span>
              <FilledInput size='small' ref={hardcodedValueFieldRef} variant="outlined" onChange={e=>setHardcodedValue(e.target.value)} value={hardcodedValue}/>
            </>)
          : (
            <>
              <span>Cимвол колонки</span>
              <FilledInput size='small' ref={sheetAliasFieldRef} variant="outlined" onChange={e=>setAlias(e.target.value)} value={alias}/>
            </>)
          }
          <Autocomplete
            disablePortal
            size='small'
            options={Object.keys(product_alias_variants)}
            onInputChange={(event, newInputValue) => {setProductAttributeName(newInputValue)}}
            value={productAttributeName}
            // sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="атрибут товара" variant="outlined" defaultValue={column.productAttributeName}/>}
          />
          {productAttributeName!=''&product_alias_variants[productAttributeName]?.useUnitsOfMeasurement?
          <Autocomplete
            disablePortal
            size='small'
            options={mesermentUnits}
            value={measurmentUnit?measurmentUnit:"см"}
            onInputChange={(event, newInputValue)=>setUsedMesermentUnit(newInputValue)}
            renderInput={(param) => (<TextField {...param} label="единица измерения" variant='outlined' defaultValue={console.log('param', param)}></TextField>)}
           />
          :null}
          <TextField size='small' onChange={e=>setStart(e.target.value)} label="начало колонки" variant="outlined" value={start}/>
          <TextField size='small' onChange={e=>setEnd(e.target.value)} label="конец колонки" variant="outlined" value={end}/>
          <TextField size='small' onChange={e=>setRegularExpression(e.target.value)} label="регулярное выражение" value={regularExpression}/>
          <Button size='small' onClick={(e)=>confirmEditing()}>сохранить изменения</Button>
        </Stack>
      );}
    else {
      elementContent = (
        <Stack>
          {/* <div onClick={showSelection}>показать выделенное</div> */}
          <div style={{textAlign: 'left'}}>Лейбл колонки: {column.alias}</div>
          <div style={{textAlign: 'left'}}>Аттрибут позиции: {column.productAttributeName}</div>
          <div style={{textAlign: 'left'}}>Тип поля: {column.fieldType}</div>
          <div style={{textAlign: 'left'}}>Начало колонки: {column.start}</div>
          <div style={{textAlign: 'left'}}>Окончание колонки: {column.end}</div>
        </Stack>
      );
    }
    // console.log(preparedData.map(item=>({alias: item})));
    return (
      <div>
        {showPreparedData?(
        <FloatingWidget onClose={(e)=>setShowPreparedData(false)} widgetTitle={`Подготовленные данные по ${productAttributeName}`}>
          <DataSheetGrid
            style={{overflowX: "scroll"}}
            value={preparedData.map(item=>{
              const row = {};
              row[alias] = item;
              return row})}
            addRowsComponent={false}
            columns={[{...keyColumn(alias, textColumn), index: "index", "title": productAttributeName }]}/>
        </FloatingWidget>
        ): undefined
        }
        <ListItem button>
          <ListItemText onClick={() => setIsCollapsed(!isCollapsed)} primary={productAttributeName?`* ${productAttributeName}`:`* ${alias}`} />
          {/* контекстное меню */}
          <div>
            <IconButton
              aria-label="more"
              id={`column-${index}`}
              aria-controls={isContextOpened ? `column-${index}` : undefined}
              aria-expanded={isContextOpened ? 'true' : undefined}
              aria-haspopup="true"
              onClick={handleClickContextMenu}>
              <MoreVertIcon/>
            </IconButton>
            <Menu
              id={`column-${index}`}
              MenuListProps={{
                'aria-labelledby': `column-${index}`,
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
          {/* конец контекстного меню */}
        </ListItem>
        <Collapse in={isCollapsed} style={{padding: 5}}>
            {elementContent}
        </Collapse>
      </div>
    );
  });

export {Column};