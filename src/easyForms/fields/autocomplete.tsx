import { Menu, MenuItem, CircularProgress } from '@mui/material';
import React, { 
  forwardRef, 
  memo, 
  useEffect, 
  useImperativeHandle, 
  useRef, 
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

const menuStyle = {
  position: "absolute",
  top: "100%",
  left: 0,
  right: 0,
  backgroundColor: "#333",
  borderRadius: "6px",
  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
  maxHeight: "200px",
  overflowY: "auto" as const,
  zIndex: 1000,
  marginTop: "4px"
};

const menuItemStyle = {
  padding: "8px 12px",
  cursor: "pointer",
  color: "white",
  fontSize: "0.9em",
  ":hover": {
    backgroundColor: "#444"
  }
};

interface InputProps {
  label: string;
  defaultValue?: string;
  defaultVariants?: Array<any>;
  getOptionLabel?: (option: any) => string;
  getVariantsOnChange?:
    | ((inputValue: string) => any[])
    | ((inputValue: string) => Promise<any[]>);
  getFormValue?: (option: any, rawValue: string) => any;
  selectionUnnecessary?: boolean;
}

export type AutocompleteRefType = {
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
      getOptionLabel,
      selectionUnnecessary = false 
    }, ref) => {

      const [options, setOptions] = useState<any[]>(defaultVariants ?? []);
      const [value, setValue] = useState<string>(defaultValue ?? "");
      const [selectedOption, setSelectedOption] = useState<any>(null);
      const [debouncedInputValue, setDebouncedInputValue] = useState<string>(defaultValue ?? "");
      const [loading, setLoading] = useState<boolean>(false);
      const [showMenu, setShowMenu] = useState<boolean>(false);
      const wrapperRef = useRef<HTMLDivElement>(null);
      const menuRef = useRef<HTMLDivElement>(null);

      useImperativeHandle(ref, () => ({
        setOptions,
        rawValue: selectedOption,
        value: getFormValue ? getFormValue(selectedOption, value) : selectedOption,
      }));

      useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
          if (wrapperRef.current && 
              !wrapperRef.current.contains(event.target as Node) &&
              !menuRef.current?.contains(event.target as Node)) {
            setShowMenu(false);
          }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }, []);

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

      const handleInputFocus = () => {
        setShowMenu(options.length > 0);
      };

      const handleSelectOption = (option: any) => {
        setSelectedOption(option);
        setValue(getOptionLabel ? getOptionLabel(option) : option);
        if (!selectionUnnecessary) {
          setShowMenu(false);
        }
      };

      const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
        setShowMenu(true);
      };

      return (
        <div ref={wrapperRef} style={{ position: "relative", width: "100%" }}>
          <input
            placeholder={label}
            style={inputStyle}
            type="text"
            value={value}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
          />
          
          {showMenu && (
            // @ts-ignore

            <div ref={menuRef} style={menuStyle}>
              {loading ? (
                <div style={{ ...menuItemStyle, justifyContent: 'center' }}>
                  Loading...
                </div>
              ) : (
                options.map((option, index) => (
                  <div
                    key={index}
                    style={menuItemStyle}
                    onClick={() => handleSelectOption(option)}
                  >
                    {getOptionLabel ? getOptionLabel(option) : option}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      );
    }
  ),
  (prevProps, nextProps) => (
    prevProps.label === nextProps.label &&
    prevProps.defaultValue === nextProps.defaultValue &&
    prevProps.defaultVariants === nextProps.defaultVariants &&
    prevProps.selectionUnnecessary === nextProps.selectionUnnecessary
  )
);