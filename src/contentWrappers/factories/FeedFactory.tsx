import React from "react";
import { v4 } from "uuid";

import { CardConfig, CardField, ContentAdapterProps } from "../types";
import { Card, IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';

import { ActionWrapper, ActionWrapperProps } from "../../components/ActionsList";
import { useMenuOfActions } from "../../components/ActionsList";


export type CardProps = {
  cardConfig: CardConfig;
  outerProps: any
}

export type CardFieldObject = {
  type: string;
  value: any;
} & CardField;

function generateInitialState(fieldConfigs: Record<string, CardField>, outerProps: any): Record<string, CardFieldObject> {
  const result: Record<string, CardFieldObject> = {};

  Object.entries(fieldConfigs).forEach(([fieldName, fieldConfig]) => {
    // Инициализация каждого поля: значение пока пустое
    // @ts-ignore
    result[fieldName] = {
      value: outerProps[fieldName]??"",
    };
  });

  return result;
}


// поля для автокарточки
// PlannedDayMealsField
// @ts-ignore
export const CardArrayField: React.FC<CardFieldObject> = ({fieldName, value}) => {
  return (
    <div>
      {value.map((item, index) => item.alias
      // (
        // <div key={index}>
          // - {}
        // </div>
    )}
    </div>
  );
}


export const FeedCard: React.FC<CardProps> = ({ cardConfig, outerProps }) => {
    const initialState = generateInitialState(cardConfig.fields, outerProps);
    const [fieldsStates, setFieldsStates] = React.useState<Record<string, CardFieldObject>>(initialState);
    const availableActions = React.useMemo(() => cardConfig.actions, [])

    const {MenuButton} = useMenuOfActions({actions: availableActions, injectionValues: {}});
    const innerCardId = React.useMemo(()=>v4(), []);

    const handleFieldChange = (fieldName: string, newValue: string) => {
      setFieldsStates((prevState) => ({
        ...prevState,
        [fieldName]: {
          ...prevState[fieldName],
          value: newValue,
        },
      }));
    };

    return (
      <Card title="Feed Card" style={{padding: "10px 15px", position: "relative", backgroundColor: '#252525'}}>
        <div style={{position: "absolute", right: 5, top: 5}}>
          {MenuButton}
        </div>

        {Object.entries(cardConfig.fields).map(([fieldName, fieldConfig]) => {
          const fieldValue = fieldsStates[fieldName]?.value || '';
          return (
            <div key={fieldName} style={{ marginBottom: 8 }}>
              <label style={{ display: 'block', marginBottom: 4 }}>
                <b>{fieldConfig.label}:</b>
              </label>

              {/* Если передан компонент React.FC, рендерим его */}
              {fieldConfig.Component? (
                <fieldConfig.Component
                  {...{
                    fieldName,
                    value: fieldValue,
                    label: fieldConfig.label,
                  }}
                />)
              : (
                // Иначе отображаем как Label
                <div style={{ paddingLeft: '15px' }}>{fieldValue}</div>
              )}
            </div>
          );
        })}
      </Card>
    );
  };


export const Feed: React.FC<ContentAdapterProps> = (props) => {
    return (
        <div style={{display: "flex", flexWrap: "wrap", justifyContent: "space-around",
          padding: "10px 15px", gap: "5px", rowGap: 5 
         }}>
            {props.objects?props.objects.map(el=> <FeedCard key={el.id} outerProps={el} cardConfig={props.vizualizationConfig.cardConfig}/>):null}
        </div>
    )
}

export function createFeedFactory(page: ContentAdapterProps, injectionValues?: Record<string, any>) {
  return {
    // здесь можно вернуть всё, что нужно для "Table"-визуализации
    Component: (injectionValues?) => <Feed {...page} injectionValues={injectionValues}/>,
  };
}