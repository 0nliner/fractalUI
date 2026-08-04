// ЕБУЧИЙ МУЙ

import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";
import { Autocomplete, TextField } from "@mui/material";
import { WidgetProps } from "@rjsf/utils";

type AutocompleteFieldCustomProps = {
  fieldName?: string;
  helperText?: string;
  variants?: Array<any>; // Варианты по умолчанию
  getOptionLabel: (option: any) => string; // Отображаемая строка для варианта
  getVariantsOnChange?: (inputValue: string) => Promise<any[]>; // Загрузка вариантов при вводе
  // Если getFormValue возвращает Promise, используем async/await
  getFormValue: (option: any) => Promise<any>;
};

type AutocompleteFieldProps = WidgetProps & AutocompleteFieldCustomProps;

interface AutocompleteFormFieldHandle {
  // Чтобы можно было снаружи перезаписывать options при необходимости
  setOptions: React.Dispatch<React.SetStateAction<any[]>>;
}

const AutocompleteFormField = forwardRef<
  AutocompleteFormFieldHandle,
  AutocompleteFieldProps
>((props, ref) => {
  const [selectedValue, setSelectedValue] = useState<any | null>(null); // выбранный объект
  const [inputValue, setInputValue] = useState<string>(""); // текст в поле ввода
  const [options, setOptions] = useState<any[]>(props.variants ?? []);
  const [loading, setLoading] = useState(false);

  // Пробрасываем наружу возможность менять options:
  useImperativeHandle(ref, () => ({
    setOptions,
    inputValue
  }));

  // При наборе текста подгружаем варианты (если нужно),
  // а потом обновляем inputValue
  const handleInputChange = async (
    event: React.SyntheticEvent,
    newInputValue: string
  ) => {
    setLoading(true);
    setInputValue(newInputValue);
    if (props.getVariantsOnChange) {
      const newOptions = await props.getVariantsOnChange(newInputValue);
      setOptions(newOptions);
    }
    setLoading(false);
  };

  // Когда пользователь выбрал вариант
  // 1) Запоминаем его в локальном состоянии
  // 2) Ждём, пока getFormValue (если она асинхронная) вернёт итоговое значение
  // 3) Передаём результат в onChange
  const handleChange = async (event: React.SyntheticEvent, newValue: any) => {
    setSelectedValue(newValue);
    const formValue = await props.getFormValue(newValue);
    props.onChange(formValue);
  };

  return (
    <Autocomplete
      freeSolo
      loading={loading}
      options={options}
      value={selectedValue}
      onChange={handleChange}
      inputValue={selectedValue? props.getOptionLabel(selectedValue): inputValue}
      onInputChange={handleInputChange}
      getOptionLabel={props.getOptionLabel}
      renderInput={(params) => (
        <TextField
          {...params}
          label={props.fieldName ?? "Select"}
          helperText={props.helperText ?? ""}
        />
      )}
    />
  );
});

export { AutocompleteFormField };
