// MyForm.tsx
import React from 'react';
import Form from '@rjsf/mui';
import { UiSchema }  from '@rjsf/utils'
import validator from '@rjsf/validator-ajv8';

import { convertOpenApiToJsonSchema, overrideRJSFSchema, Overrides } from './utils';
import { AppProviderContext } from '../providers/AppProvider';


interface FormParams {
    schemaName: string
    UISchema?: UiSchema
    handleSubmit: (formData: any) => void
    widgets?: any,
    fields?: any
  }

export type {FormParams};

export type AutoFormProps = FormParams & {
  overrides?: Overrides};
 
type AnyObject = { [key: string]: any };

// const muiTheme = createTheme({
//   components: {
//     MuiTextField: {
//       styleOverrides: {
//         root: {
//           '& .MuiInputBase-root': {
//             padding: 0,
//             margin: 0,
//             color: 'white',
//             backgroundColor: 'transparent',
//             fontSize: '0.7em',
//             height: '24px',
//             borderRadius: '6px',
//             '& .MuiInputBase-input': {
//               padding: '4px 8px',
//             },
//           },
//         },
//       },
//     },
//     MuiInputBase: {
//       styleOverrides: {
//         root: {
//           '&:before, &:after': {
//             borderBottom: 'none !important',
//           },
//         },
//         input: {
//           padding: '4px 8px !important',
//         },
//       },
//     },
//   },
// });


const AutoForm: React.FC<AutoFormProps> = (props) => {
  const {openapiSpec} = React.useContext(AppProviderContext);
  if (!openapiSpec) return <div>problems with openApiSpec</div>

  // @ts-ignore
  const openApiSchema = openapiSpec?.components.schemas[props.schemaName];
  let schemaDefinitions: any = {};

  function substitute(refValue: string): any {
    // заменяет синтаксис openapi определения значения в $ref на формат rjsf
    // подставляет итоговую схему в schemaDefinitions, где ключ 
    // схемы - это значение от $ref
  
    const componentRegexp = "#/components/schemas/(?<match>.*)"
    const componentNameMatch = refValue.match(componentRegexp)
    if (componentNameMatch === undefined || !componentNameMatch || componentNameMatch.groups === undefined) throw new Error('не найдено имя компонента')
    const componentName = componentNameMatch.groups['match']
    // @ts-ignore
    let componentSchemaRaw = openapiSpec.components.schemas[componentName]
    componentSchemaRaw = componentSchemaRaw.enum ? {"enum": componentSchemaRaw.enum}:componentSchemaRaw;
    const componentSchema = convertOpenApiToJsonSchema(componentSchemaRaw)
    schemaDefinitions[componentName] = componentSchema 

    return {definedAt: `#/definitions/${componentName}`, componentName: componentName};
  }

  function removeKey(obj: any, keyToRemove: any) {
    if (typeof obj !== 'object' || obj === null) {
      return;
    }
  
    for (const key in obj) {
      if (key === keyToRemove) {
        delete obj[key];
      } else if (typeof obj[key] === 'object') {
        removeKey(obj[key], keyToRemove);
      }
    }
  }
  
  function deepSearchAndSubstitute(obj: AnyObject): AnyObject {
    // Создаем копию объекта, чтобы не изменять оригинал
    let result: AnyObject = Array.isArray(obj) ? [] : {};
  
    for (const key in obj) {
      const value = obj[key];
      if (key === 'anyOf' && Array.isArray(value)) {
        let new_value = value.find(item => item.type !== "null");
        new_value = deepSearchAndSubstitute(new_value)
        if (!new_value) {
          throw new Error("Не удалось найти значение, отличное от null");
        }
        result = new_value;
      }  
      else if (obj.hasOwnProperty(key) && key === "$schema") {
          // ничего не делаем, по сути пропускаем это значение
          continue;
        }
      else if (key === '$ref' && typeof value === 'string' && value.startsWith("#/components/")) {
          // Если найден ключ $ref, вызываем функцию substitute
          const substitutedValue = substitute(value);
          // Продолжаем рекурсивный поиск в новом значении
          result[key] = substitutedValue.definedAt
          schemaDefinitions[substitutedValue.componentName] = deepSearchAndSubstitute(schemaDefinitions[substitutedValue.componentName]);
        }
      else if (typeof value === 'object' && value !== null) {
          // Если значение - объект, продолжаем рекурсивный поиск
          result[key] = deepSearchAndSubstitute(value);
        }
      else {
          // Если значение не объект и не $ref, просто копируем его
          result[key] = value;
        }
      }  
    return result;
  }


  if (!openApiSchema) {
    return <div>Загрузка формы...</div>;
  }

  let schema = openApiSchema;
  removeKey(schema, "$schema");
  let schemaProperties;

  // почему-то при повторном рендере форма схема имеет иной вид, нежеди при первом рендере
  // на всякий надо делать клоны объектов, а не мутировать их 
  if (schema.definitions === undefined) {
    schemaProperties = deepSearchAndSubstitute(schema.properties);
    schema.properties = schemaProperties;
    schema.definitions = schemaDefinitions
    if (props.overrides) {
      schema = overrideRJSFSchema(schema, props.overrides);
    }    
  }

  if (!schema) {
    console.log("schema", schema);
    return <div>Загрузка формы...</div>;
  }

  const GeneratedForm = React.useMemo(
    () => {
      return (<Form schema={schema}
        uiSchema={props.UISchema}
        onSubmit={props.handleSubmit}
        validator={validator}
        widgets={props.widgets}
        fields={props.fields}
        />)
    }, []
  )
  console.log("form", GeneratedForm);
  return GeneratedForm;
};

export {AutoForm};
