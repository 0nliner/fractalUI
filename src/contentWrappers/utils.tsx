import React, { useContext } from "react";
import { NavigationProps } from "../components/navigations/types";
import { PageConfig, AppConfig } from "./types";
import tableFactory from "./factories/TableFactory";
import { AppProviderContext, AppProviderContextType } from "../providers/AppProvider";
import { DefaultContentPort, DefaultContentPortProps } from "./DefaultPagePort";
import { createFeedFactory as feedFactory } from "./factories/FeedFactory";
import md5 from 'md5';


/**
 * Функция, которая из AppGeneratedProps формирует NavigationProps.
 * TODO: вынести отсюда генератор контент-адаптеров
 */
export const generateContentApapterComponent = (page: PageConfig) => {
  let componentFactory;
  if (!page.vizualizationConfig && page.PageComponent) {
    // @ts-ignore
    componentFactory = () => ({Component: (injectionValues_) => <page.PageComponent {...page} injectionValues={injectionValues_}/>})
  }
  else {
    switch (page.vizualizationConfig.vizualizationComponent) {
      case "Table":
        componentFactory = tableFactory;
        break;
      case "Feed":
        componentFactory = feedFactory;
        break;
      default:
        // На случай, если в будущем появятся новые варианты
        componentFactory = null;
        break;
    }
  }

    // Собираем элемент навигации
    return {
      Component: (injectionValues) => {
        let preparedInjectionValues = Object.keys(injectionValues).reduce((newObj, key) => {
          if (key === 'injectionValues') {
            // Если ключ injectionValues встречается, переименовываем его в previousInjectionValues
            newObj['previousInjectionValues'] = injectionValues[key];
          } else {
            // Иначе копируем значение как есть
            newObj[key] = injectionValues[key];
          }
          return newObj;
        }, {});

        return <DefaultContentPort injectionValues={preparedInjectionValues} {...page} ContentAdapter={componentFactory}/>
      },
    };
}

export function generateNavigationItems(appProps: AppConfig): NavigationProps {
  // Если pagesConfig не задан, возвращаем пустую навигацию
  if (!appProps.pagesConfig) {
    return {};
  }
  // TODO: улучшить аннотации в этом сегменте
  const navigationItems = appProps.pagesConfig.map(page => {
    // В зависимости от vizualizationComponent выбираем нужную "фабрику".
    // TODO: компонент не прокидывать сюда
    const generationResult = generateContentApapterComponent(page);

    // Собираем элемент навигации
    return {
      icon: page.pageIcon,
      title: page.pageName,
      link: page.pageURI,
      ...generationResult
    };
  });

  // Можно возвращать либо "плоский" список элементов, либо разбивать по секциям
  return {
    navigationItems
  };
}

export const useAPIActionFromOperationId = (operationId?: string): (data: any) => Promise<any> => {
  if (operationId === null) return null
  const {api_sdk_module} = useContext(AppProviderContext);
  const action = api_sdk_module[operationId]
  return action;
}


export const getSchemaName = (obj: object) => {
  // @ts-ignore
  let schema = obj.content["application/json"].schema
  if (schema.anyOf) {
    schema = schema.anyOf[0]
  }
  else if (schema.items) {
    schema = schema.items
  }
  return schema.$ref.split("/").at(-1)
}


function snakeToCamel(str: string): string {
  return str
      .split('_') // Разделяем строку по символу "_"
      .map((word, index) => {
          if (index === 0) {
              // Первое слово должно начинаться с маленькой буквы
              return word.toLowerCase();
          }
          // Остальные слова начинаются с заглавной буквы
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(''); // Собираем массив обратно в строку
}


function camelToSnake(str: string): string {
  return str
      .replace(/([A-Z])/g, '_$1') // Находим заглавные буквы и добавляем перед ними "_"
      .toLowerCase(); // Преобразуем всю строку в нижний регистр
}


export const useSchemasFromOperationId = (operationId: string) => {
  // Получаем контекст
  const { openapiSpec } = useContext(AppProviderContext);

  // Логика получения схемы
  const getSchemas = () => {
      const preparedOperationID = camelToSnake(operationId);
      // @ts-ignore
      if (openapiSpec && openapiSpec.paths) {
          // @ts-ignore
          const operation = Object.entries(openapiSpec.paths).flatMap(([path, httpMethods]) =>
            Object.entries(httpMethods).map(([method, details]) =>
                details.operationId === preparedOperationID ? { path, method, details } : null
            )
        ).find(Boolean);

          return {
              body: operation?.details.requestBody ? getSchemaName(operation.details.requestBody) : null,
              // response: getSchemaName(Object.values(operation.responses)[0]),
              // parameters: operation.parameters
          };
      }

      return null;
  };

  return getSchemas();
};
