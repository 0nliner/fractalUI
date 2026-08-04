// @ts-nocheck
import React from "react";
import { AutocompleteFormField } from "../../../autoforms/AutocompleteField";
import { MultipleAutocompleteFormField } from "../../../autoforms/MultipleAutocompleteField";
import { filterStudents, getMealTimeAliases, getMenus } from "../../../../api_client";


export const StudentAutocompleteField = (props: any) => {
  const inputRef = React.useRef(null);
  const getUserVariants = async (fullname_substring: string) => {
    const variants = await filterStudents({query: {
      page: 1,
      size: 10},
      body: {name_substring: fullname_substring }});

    if (!variants || !variants.data) return [];
    const newOptions =  variants.data.map((variant) => ({
      ...variant,
      label: `${variant.firstname} ${variant.secondname} ${variant.lastname}`
    }));
    return newOptions;
    // inputRef.current?.setOptions(newOptions)
  }

  return (
    <MultipleAutocompleteFormField
        {...props}
        ref={inputRef}
        getVariantsOnChange={getUserVariants}
        getOptionLabel={(option) => option?.label || ''}
        helperText="Начните вводить имя студента"
        getFormValue={(value)=>value.inner_id}
        />
  )
}


export const useVariants = (operation: Promise<any>) => {
  const [variants_, setVariants] = React.useState([]);
  const variants = React.useMemo(() => {
    return variants_;
  }, [variants_])

  React.useEffect(()=> {
    const fetchData = async () => {
        const response = await operation;
        const menus = response.data;
        setVariants(menus);
      }
    fetchData();
  },
  []);
  return variants
}


export const MealTimeAliasAutocompleteField = (props: any) => { 
  const mealTimeAliasesRef = React.useRef(null);
  const mealTimeAliases = useVariants(getMealTimeAliases());

  React.useEffect(()=> {
    const fetchData = async () => {
        if (mealTimeAliasesRef.current && mealTimeAliases) {
          mealTimeAliasesRef.current.setOptions(mealTimeAliases);
        }
      }
    fetchData();
  }, [mealTimeAliases]);

  return ( 
    <AutocompleteFormField
      {...props}
      variants={mealTimeAliases}
      ref={mealTimeAliasesRef}
      getOptionLabel={(option) => option}
      getFormValue={(value)=>value}
      />
  )};



export const MenuAutocompleteField = (props: any) => {
    const menuVariantsRef = React.useRef(null);
    const menuVariants = useVariants(getMenus());

    const getLabel = (option) => {
      return option.menu_name;
    }

    React.useEffect(()=> {
      const fetchData = async () => {
          if (menuVariantsRef.current && menuVariants) {
            menuVariantsRef.current.setOptions(menuVariants);
          }
        }
      fetchData();
    }, [menuVariants]);

    return (
      <AutocompleteFormField
        {...props}
        ref={menuVariantsRef}
        getVariantsOnChange={(input: string)=>menuVariants}
        variants={menuVariants}
        getOptionLabel={getLabel}
        getFormValue={(value)=>value.id}
        />)
  };
