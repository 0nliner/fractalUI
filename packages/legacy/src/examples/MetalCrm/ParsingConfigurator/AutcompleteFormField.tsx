// @ts-nocheck
import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import { filterByPropertyValue } from '../../../../api_client/sdk.gen';


export function AutocompleteFormField(
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

