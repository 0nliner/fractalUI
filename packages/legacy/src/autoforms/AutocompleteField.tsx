import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";
import { Autocomplete, TextField, Paper, Typography } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import { WidgetProps } from "@rjsf/utils";

type AutocompleteFieldCustomProps = {
  helperText?: string;
  variants?: Array<any>; // Варианты по умолчанию
  getOptionLabel: (option: any) => string; // Отображаемая строка для варианта
  getVariantsOnChange?:
    | ((inputValue: string) => any[]) // Синхронная функция
    | ((inputValue: string) => Promise<any[]>); // Асинхронная функция
  getFormValue: (option: any) => any;
};

type AutocompleteFieldProps = WidgetProps & AutocompleteFieldCustomProps;

interface AutocompleteFormFieldHandle {
  setOptions: React.Dispatch<React.SetStateAction<any[]>>;
}

const AutocompleteFormField = forwardRef<
  AutocompleteFormFieldHandle,
  AutocompleteFieldProps
>((props, ref) => {
  const [uniqueInputID] = useState<string>(uuidv4());
  const [selectedValue, setSelectedValue] = useState<any | null>(null); // Выбранный объект
  const [inputValue, setInputValue] = useState<string>("");
  const [options, setOptions] = useState<any[]>(props.variants ?? []);
  const [loading, setLoading] = useState(false);

  useImperativeHandle(ref, () => ({
    setOptions,
    formValue: selectedValue ? props.getFormValue(selectedValue) : null,
  }));

  // Добавляем задержку для запросов
  const [debouncedInputValue, setDebouncedInputValue] = useState<string>("");
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedInputValue(inputValue);
    }, 300); // Задержка 300 мс
    return () => clearTimeout(timer);
  }, [inputValue]);

  // Обработка изменения вариантов
  useEffect(() => {
    if (debouncedInputValue && props.getVariantsOnChange) {
      setLoading(true);

      // Проверяем, является ли результат промисом или обычным массивом
      const fetchOptions = async () => {
        const result = props.getVariantsOnChange(debouncedInputValue);

        if (result instanceof Promise) {
          // Если это промис, ждём его выполнения
          const newOptions = await result;
          setOptions(newOptions);
        } else {
          // Если это синхронный массив, используем его сразу
          setOptions(result);
        }

        setLoading(false);
      };

      fetchOptions();
    }
  }, [debouncedInputValue, props.getVariantsOnChange]);

  // Обновление значения формы
  useEffect(() => {
    if (selectedValue) {
      const formValue = props.getFormValue(selectedValue)
      props?.onChange?.(formValue);
    }
  }, [selectedValue, props.getFormValue, props.onChange]);

  // Обновление состояния localStorage
  const handleChange = (newValue: any) => {
    setSelectedValue(newValue);
    const label = props.getOptionLabel?.(newValue) || "";
    setInputValue(label);
  };

  return (
    <div>
      {/* Поле автозаполнения */}
      <Autocomplete
        id={uniqueInputID}
        fullWidth // Поле занимает всю доступную ширину
        options={options}
        getOptionLabel={props.getOptionLabel}
        loading={loading}
        value={selectedValue}
        onChange={(_, newValue) => handleChange(newValue)}
        onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
        renderInput={(params) => (
          <TextField
            {...params}
            label={props.uiSchema["ui:title"] || props.idSchema.name}
            variant="outlined"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? <span>Загрузка...</span> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
        renderOption={(elProps, option) => (
          <Paper
            key={option.id}
            elevation={3}
            // style={{ padding: "10px", margin: "5px 0", }}
          >
            <Typography {...elProps}>{props.getOptionLabel(option)}</Typography>
          </Paper>
        )}
      />
    </div>
  );
});

export { AutocompleteFormField };