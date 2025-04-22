import { openapiSchemaToJsonSchema as toJsonSchema } from "@openapi-contrib/openapi-schema-to-json-schema";
import { useSchemasFromOperationId } from "../contentWrappers/utils";
import { AutoForm } from "./AutoForm";
import React, { useContext } from "react";


export function convertOpenApiToJsonSchema(openApiSchema: any): any {
  const jsonSchema = toJsonSchema(openApiSchema);
  return jsonSchema;
}


export async function fetchOpenApiSpec(): Promise<any> {
    // TODO: сделать проброс параметров о том откуда забирать спеку
    const useApiGateway = true;
    let response
    if (useApiGateway) {
      response = await fetch(import.meta.env.VITE_SPEC_URL, {method: "GET"})
    }
    else {
      response = await fetch(`http://${import.meta.env.VITE_BACKEND_IP}:${import.meta.env.VITE_BACKEND_PORT}/openapi.json`, {method: "GET", });
    }
    if (!response.ok) {
      throw new Error(`Ошибка HTTP при получении OpenAPI спецификации: ${response.status}`);
    }
    const data = await response.json();
    return data;
  }


export const downloadMinioFile = async (fileLink: string) => {
    const response = await fetch(fileLink);
    if (!response.ok) {
      throw new Error(`Ошибка при загрузке файла: ${response.statusText}`);
    }
    const blob = await response.blob();
    const fileName = "file.xlsx"
    const file = new File([blob], fileName, { type: blob.type });
    return file
}

export type Overrides = Record<string, any>;
export type Schema = Record<string, any>;

export function overrideRJSFSchema(
  originalSchema: Schema,
  overrides: Overrides
): Schema {
  // Глубокая копия, чтобы не мутировать исходный объект
  // Можно использовать structuredClone
  // или другую библиотеку для глубокого клонирования
  const newSchema: Schema = JSON.parse(JSON.stringify(originalSchema));

  Object.entries(overrides).forEach(([rawKey, newValue]) => {
    const [possibleDropItem, ...restParts] = rawKey.split(" ");

    if (possibleDropItem === "dropItem") {
      // Если key начинается с "dropItem", то оставшаяся часть — это путь к массиву
      const arrayPath = restParts.join(" ");
      const keys = arrayPath.split(".");

      // Переходим по пути в newSchema, чтобы найти нужный массив
      let current: any = newSchema;
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (current[key] === undefined) {
          // Если путь не существует — ничего не делаем
          return;
        }
        current = current[key];
      }

      // current — это массив, из которого нужно удалить элементы
      if (Array.isArray(current) && Array.isArray(newValue)) {
        // Удаляем все элементы, которые совпадают с элементами массива newValue
        for (let i = current.length - 1; i >= 0; i--) {
          // Если элемент массива есть в списке на удаление — удаляем
          if (newValue.includes(current[i])) {
            current.splice(i, 1);
          }
        }
      }
      
      // При необходимости можно добавить логику:
      // else if (!Array.isArray(newValue)) - удалять одно значение или игнорировать
      // но это зависит от того, какую именно хотите реализацию
    } else {
      // Обычная логика переопределения по пути, если ключ не "dropItem"
      const keys = rawKey.split(".");
      let current: any = newSchema;
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (current[key] === undefined) {
          current[key] = {};
        }
        current = current[key];
      }

      const lastKey = keys[keys.length - 1];
      current[lastKey] = newValue;
    }
  });

  return newSchema;
}


// export type 


import { useMemo } from 'react';
import { AppProviderContext } from "../providers/AppProvider";
import { Action } from "../contentWrappers/types";

export const useFormFromOperationID = (
  action: Action,
  handleSubmit: (formData: string) => void
  ): React.ReactNode | null => {

  const {operationId} = action;
    // Если operationID не передан, возвращаем null
  const { openapiSpec } = useContext(AppProviderContext);

  if (!operationId || !openapiSpec) {
    return null;
  }

  // Получаем схемы для указанного operationID
  const schemas = useSchemasFromOperationId(operationId);

  // Кешируем форму с помощью useMemo
  const formComponent = useMemo(() => {
    if (schemas?.body) {
      return (
        <AutoForm
          schemaName={schemas.body}
          UISchema={action.formUISchema ?? undefined}
          fields={action.fields ?? undefined}
          overrides={action.overrides ?? undefined}
          handleSubmit={handleSubmit}
        />
      );
    }
    return null;
  }, [openapiSpec]);

  return formComponent;
};