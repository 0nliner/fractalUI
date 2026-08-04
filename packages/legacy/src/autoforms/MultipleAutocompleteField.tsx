import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";
import {
  Autocomplete,
  TextField,
  Chip,
  Paper,
  Typography,
  Box,
} from "@mui/material";
import { WidgetProps } from "@rjsf/utils";


type MultipleAutocompleteFieldCustomProps = {
  helperText?: string;
  variants?: Array<any>; // Варианты по умолчанию
  title?: string;
  getOptionLabel: (option: any) => string; // Отображаемая строка для варианта
  getVariantsOnChange?: (inputValue: string) => Promise<any[]>; // Загрузка вариантов при вводе
  getFormValue: (option: any) => Promise<any>;
};

type MultipleAutocompleteFieldProps = WidgetProps & MultipleAutocompleteFieldCustomProps;

interface AutocompleteFormFieldHandle {
  setOptions: React.Dispatch<React.SetStateAction<any[]>>;
}

const MultipleAutocompleteFormField = forwardRef<
  AutocompleteFormFieldHandle,
  MultipleAutocompleteFieldProps
>((props, ref) => {
  const [inputValue, setInputValue] = useState<string>(""); // Текст в поле ввода
  const [options, setOptions] = useState<any[]>(props.variants ?? []);
  const [loading, setLoading] = useState(false);
  const [chosenOptions, setChosenOptions] = useState<Array<any>>([]); // Выбранные варианты

  useImperativeHandle(ref, () => ({
    setOptions,
  }));

  // Дебаунсинг для запросов вариантов
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

      const fetchOptions = async () => {
        const result = await props.getVariantsOnChange(debouncedInputValue);
        setOptions(result);
        setLoading(false);
      };

      fetchOptions();
    } else {
      setOptions(props.variants ?? []);
      setLoading(false);
    }
  }, [debouncedInputValue, props.getVariantsOnChange, props.variants]);

  // Обновление значения формы
  useEffect(() => {
    const updatedFormValues = chosenOptions.map((opt) =>
      props.getFormValue(opt)
    );
    Promise.all(updatedFormValues).then((values) => {
      props.onChange?.(values); // Обновляем значение формы
    });
  }, [chosenOptions, props.getFormValue, props.onChange]);

  // Функция для обработки выбора варианта
  const handleSelectOption = (option: any) => {
    setChosenOptions((prev) => [...prev, option]); // Добавляем выбранный вариант
    setInputValue(""); // Очищаем поле ввода
  };

  // Функция для удаления выбранного варианта
  const handleRemoveOption = (optionToRemove: any) => {
    setChosenOptions((prev) =>
      prev.filter((opt) => opt !== optionToRemove)
    );
  };

  return (
    <div style={{ position: "relative", width: "100%" }}>
      {/* Заголовок */}
      {props.title && (
        <Typography variant="subtitle1" gutterBottom>
          {props.title}
        </Typography>
      )}

      {/* Поле ввода с Material-UI TextField */}
      <Autocomplete
        id={props.idSchema.$id}
        freeSolo
        options={options}
        getOptionLabel={props.getOptionLabel}
        loading={loading}
        value={null} // Не сохраняем выбранное значение в Autocomplete
        onChange={(_, newValue) => {
          if (newValue) {
            handleSelectOption(newValue); // Обрабатываем выбор варианта
          }
        }}
        onInputChange={(_, newInputValue) => setInputValue(newInputValue)} // Обрабатываем изменение ввода
        renderInput={(params) => (
          <TextField
            {...params}
            label={props.uiSchema["ui:title"] || props.idSchema.name}
            variant="outlined"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? (
                    <Typography color="textSecondary">Загрузка...</Typography>
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
        renderOption={(itemProps, option) => (
          <Paper
            key={option.id}
            elevation={3}>
            <Typography {...itemProps}>{props.getOptionLabel(option)}</Typography>
          </Paper>
        )}
      />

      {/* Отображение выбранных элементов через Chip */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1,
          mt: 1,
        }}
      >
        {chosenOptions.map((option) => (
          <Chip
            key={props.getOptionLabel(option)}
            label={props.getOptionLabel(option)}
            onDelete={() => handleRemoveOption(option)}
            size="small"
            style={{ fontSize: 12 }}
          />
        ))}
      </Box>
    </div>
  );
});

export { MultipleAutocompleteFormField };