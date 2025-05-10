import { Menu, MenuItem, CircularProgress } from '@mui/material';
import React, { 
  forwardRef, 
  memo, 
  useEffect, 
  useImperativeHandle, 
  useMemo, 
  useState 
} from 'react';


const inputStyle = {
    padding: 0,
    margin: 0,
    border: "none",
    color: "white",
    background: "none",
    fontSize: "1em",
    height: "24px",
    borderRadius: "6px",
    outline: "none"
};


interface InputProps {
  label: string;
  defaultValue?: string;
  defaultVariants?: Array<any>;
  getOptionLabel?: (option: any) => string;
  getVariantsOnChange?:
    | ((inputValue: string) => any[])
    | ((inputValue: string) => Promise<any[]>);
  getFormValue?: (option: any) => any;
}

type AutocompleteRefType = {
  setOptions: React.Dispatch<React.SetStateAction<any[]>>;
  rawValue: any;
  value: any;
}

export const AutocompleteInput = memo(
  forwardRef<AutocompleteRefType, InputProps>(
    ({ 
      label, 
      defaultValue, 
      defaultVariants, 
      getFormValue, 
      getVariantsOnChange,
      getOptionLabel 
    }, ref) => {

      const [options, setOptions] = useState<any[]>(defaultVariants ?? []);
      const [value, setValue] = useState<string>(defaultValue ?? "");
      const [selectedOption, setSelectedOption] = useState<any>(null);
      const [debouncedInputValue, setDebouncedInputValue] = useState<string>(defaultValue ?? "");
      const [loading, setLoading] = useState<boolean>(false);
      const [showMenu, setShowMenu] = useState<boolean>(false);
      const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

      useImperativeHandle(ref, () => ({
        setOptions,
        rawValue: selectedOption,
        value: getFormValue ? getFormValue(selectedOption) : selectedOption,
      }));

      useEffect(() => {
        const timer = setTimeout(() => {
          setDebouncedInputValue(value);
        }, 600);
        return () => clearTimeout(timer);
      }, [value]);

      useEffect(() => {
        if (debouncedInputValue.trim() && getVariantsOnChange) {
          setLoading(true);
          const fetchOptions = async () => {
            try {
              const result = getVariantsOnChange(debouncedInputValue);
              const newOptions = result instanceof Promise ? await result : result;
              setOptions(newOptions);
              setShowMenu(newOptions.length > 0);
            } catch (error) {
              console.error('Error fetching options:', error);
              setOptions([]);
            } finally {
              setLoading(false);
            }
          };
          fetchOptions();
        } else {
          setOptions([]);
          setShowMenu(false);
        }
      }, [debouncedInputValue, getVariantsOnChange]);

      const handleInputFocus = (event: React.FocusEvent<HTMLInputElement>) => {
        setAnchorEl(event.currentTarget);
        setShowMenu(options.length > 0);
      };

      const handleSelectOption = (option: any) => {
        setSelectedOption(option);
        setValue(getOptionLabel ? getOptionLabel(option) : option);
        setShowMenu(false);
      };

      return (
        <div style={{ position: "relative" }}>
          <input
            placeholder={label}
            style={inputStyle}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={handleInputFocus}
          />
          
          {showMenu && (
            <Menu
              anchorEl={anchorEl}
              open={showMenu}
              onClose={() => setShowMenu(false)}
              PaperProps={{
                style: {
                  maxHeight: 200,
                  width: 250,
                },
              }}
            >
              {loading ? (
                <MenuItem style={{ justifyContent: 'center' }}>
                  <CircularProgress size={20} />
                </MenuItem>
              ) : (
                options.map((option, index) => (
                  <MenuItem
                    key={index}
                    onClick={() => handleSelectOption(option)}
                  >
                    {getOptionLabel?getOptionLabel(option):option}
                  </MenuItem>
                ))
              )}
            </Menu>
          )}
        </div>
      );
    }
  ),
  (prevProps, nextProps) => (
    prevProps.label === nextProps.label &&
    prevProps.defaultValue === nextProps.defaultValue &&
    prevProps.defaultVariants === nextProps.defaultVariants
  )
);