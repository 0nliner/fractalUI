// @ts-nocheck
import { WidgetProps } from "@rjsf/utils";
import { Box, Button, Checkbox, MenuItem, Select, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { AutocompleteFormField } from "../../autoforms/AutocompleteField_fucked";
import { filterByPropertyValue, searchVendors } from "../../../api_client";


export const Sizes = (props: any) => {
    if (!props) return null;
    const prepareSize = (size: string) => {
        const sizePrepared: number[] = size.replace("[", "").replace(")", "").split(",").map(el=>{
            const prepared = Number.parseFloat(el).toFixed(3)
            let preparedString = prepared.toString()
            if (preparedString.endsWith(".000")) {
                return Math.round(prepared)
            }
            else if (preparedString.includes(".")) {
                const dotIndex = preparedString.indexOf(".")
                for (let i = preparedString.length -1; i > dotIndex; i--) {
                    const newChar = preparedString[i]
                    if (newChar === "0") {
                        continue
                    }
                    else {
                        preparedString = preparedString.slice(0, i + 1)        
                        break
                    }}
                return preparedString
            }
            return prepared
        });
        if ((sizePrepared[1] - sizePrepared[0]) < 0.002) {
            return <>{sizePrepared[1]}</>
        }
        else {
            return <>{sizePrepared[0]} - {sizePrepared[1]}</>
        }
    }

    const translations = {
        length: "длина",
        diameter: "диаметр",
        height: "высота",
        width: "ширина",
        thickness: "толщина"
    }

    return (
        <div style={{display: "flex",
                    flexDirection: "column",
                    gap: 5,
                    padding: 4,
                    borderRadius: 3, 
                    backgroundColor: "rgba(0, 0, 0, 0.13)"}}>
            {props.row.original.sizes?.map(size=>{
                if (size && size.value_range) {
                return (
                <div style={{display: "flex", gap: 2, justifyContent: "space-between", fontSize: 11}}>
                    <div style={{padding: "3px 5px", backgroundColor: "rgba(62, 99, 90, 0.5)", color: "rgba(173, 216, 230, 1)", borderRadius: 3}}>
                        <b>{translations[size.field_name]}({size.measurment_unit}): </b><br/>
                    </div>
                    {size.value_range && prepareSize(size.value_range)}
                </div>
                )}
                })}
        </div>
    )
}



export const ParsingConfigurationField = (props: WidgetProps) => {
    const [fileName, setFileName] = useState<string>(''); // Хранит имя файла
    const [fileContent, setFileContent] = useState<string>(''); // Хранит содержимое файла
  
    // Обработчик изменения значения формы
    const onChange = (value: string) => {
      props.onChange(value); // Обновляем значение в форме
    };
  
    // Обработчик выбора файла
    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
  
      // Считываем содержимое файла
      const reader = new FileReader();
      reader.onload = async (e) => {
        if (e.target && typeof e.target.result === 'string') {
          try {
            const parsedJson = JSON.parse(e.target.result); // Пытаемся распарсить JSON
            const serializedJson = JSON.stringify(parsedJson); // Сериализуем обратно в строку
  
            // Обновляем состояние и значение формы
            setFileName(file.name);
            setFileContent(serializedJson);
            onChange(serializedJson); // Устанавливаем значение в форму
          } catch (error) {
            console.error('Ошибка при парсинге JSON:', error);
            alert('Выбранный файл не является валидным JSON');
          }
        }
      };
  
      reader.readAsText(file); // Читаем файл как текст
    };
  
    // Очистка состояния
    const clearField = () => {
      setFileName('');
      setFileContent('');
      onChange(''); // Очищаем значение в форме
    };
  
    return (
      <Box>
        {/* Отображение имени файла */}
        <Typography variant="body1" color={fileName ? 'primary' : 'textSecondary'}>
          {fileName || 'Нет выбранного файла'}
        </Typography>
  
        {/* Кнопка для выбора файла */}
        <Button
          variant="contained"
          component="label"
          sx={{ marginTop: 1 }}
        >
          Выбрать файл
          <input
            type="file"
            hidden
            accept=".json"
            onChange={handleFileSelect}
          />
        </Button>
  
        {/* Кнопка очистки */}
        {fileName && (
          <Button
            variant="outlined"
            color="error"
            onClick={clearField}
            sx={{ marginTop: 1 }}
          >
            Очистить
          </Button>
        )}
      </Box>
    );
};

export const SelectVendorField = (props: WidgetProps) => {
    const fieldRef = React.useRef(null);
    return ( 
      <AutocompleteFormField
        fieldName="Выбор вендора"  
        {...props}
        ref={fieldRef}
        getVariantsOnChange={(inputValue)=> {
            const fetchData = async() => { 
                const response = await searchVendors({query: {substring: inputValue, with_unique_documents_titles: false}})
                return response.data
                }
            return fetchData()}}
        getOptionLabel={(option) => option.title}
        getFormValue={(value)=>value.id}
        />)
}


export const SelectProductTypeField = (props: WidgetProps) => {
    const fieldRef = React.useRef(null);
    return ( 
      <AutocompleteFormField
        fieldName="Тип продукта"
        {...props}
        ref={fieldRef}
        getVariantsOnChange={(inputValue)=> {
            const fetchData = async() => { 
                const response = await filterByPropertyValue({query: {substring: inputValue, propery_type: "type"}})
                return response.data
                }
            return fetchData()}}
        getOptionLabel={(option) => option}
        getFormValue={(value)=>value?value:""}
        />)
}


export const SelectSteelMarkField = (props: WidgetProps) => {
    const fieldRef = React.useRef(null);
    return ( 
      <AutocompleteFormField
        fieldName="Марка металла"
        {...props}
        ref={fieldRef}
        getVariantsOnChange={(inputValue)=> {
            const fetchData = async() => { 
                const response = await filterByPropertyValue({query: {substring: inputValue, propery_type: "steel_mark"}})
                return response.data
                }
            return fetchData()}}
        getOptionLabel={(option) => option}
        getFormValue={(value)=>value}
        />)
}

export const RangeInputWidget = (props: WidgetProps) => {
    const { value, required, onChange, schema, uiSchema } = props;
    const [rangeValues, setRangeValues] = useState<number[]>(Array.isArray(value) ? value : [0, 999999999]);
    const [isEnabled, setIsEnabled] = useState(false);
    const [measurmentUnit, setMeasurmentUnit] = useState('см');
    const [isLoading, setIsLoading] = useState(true);

    React.useEffect(() => {
        if (!isLoading) {
            const formData = {
                value: rangeValues,
                units: measurmentUnit,//? MEASURMENT_MAPPINGS[measurmentUnit]: "",
                useFilter: isEnabled
            }
            props.onChange(formData);   
        }
    }, [isEnabled, rangeValues, measurmentUnit])

    React.useEffect(() => {
        const timeout = setTimeout(() => {
            const formData = {
                value: [0, 999999999],
                units: 'см',
                useFilter: false
            }
            // props.onChange(formData);
            setIsLoading(false);
        }, 1000)
        return () => clearTimeout(timeout);
    }, [])

    // Обработчик изменения первого значения
    const handleMinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseFloat(event.target.value);
      setRangeValues([newValue, rangeValues[1]]);
      onChange([newValue, rangeValues[1]]);
    };
  
    // Обработчик изменения второго значения
    const handleMaxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseFloat(event.target.value);
      setRangeValues([rangeValues[0], newValue]);
      onChange([rangeValues[0], newValue]);
    };

    return (
        <div>
            <div style={{ display: 'flex', gap: '16px'}}>
                <label style={{display: "flex", alignItems: "center", width: "100px"}}>{uiSchema?.["ui:title"] || schema.title}</label>
                <Checkbox checked={isEnabled} onChange={() => setIsEnabled(!isEnabled)}/>
            </div>
            {
                isEnabled && 
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginTop: "10px"}}>
                {/* Заголовок */}
                <Select size="small" 
                        defaultValue={props.schema.properties.units.enum[0]}
                        options={props.options}
                        onChange={e=>setMeasurmentUnit(e.target.value)}>
                    {props.schema.properties.units.enum.map(unit=> (
                        <MenuItem key="unit" value={unit}>{unit}</MenuItem>
                    ))}
                </Select>
                {/* Первое поле ввода */}
                <TextField
                label="Минимальное значение"
                type="number"
                size="small"
                value={rangeValues[0]}
                onChange={handleMinChange}
                required={required}
                InputLabelProps={{ shrink: true }}
                />
        
                {/* Второе поле ввода */}
                <TextField
                label="Максимальное значение"
                type="number"
                value={rangeValues[1]}
                size="small"
                onChange={handleMaxChange}
                required={required}
                InputLabelProps={{ shrink: true }}
                />
        
                {/* Описание */}
                {props.description && <p>{props.description}</p>}
            </div>
            }
    </div>
    );
  };