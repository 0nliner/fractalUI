import React from "react";
import { CardConfig, CardField, ContentAdapterProps } from "../types";
import { Card, IconButton, Menu, MenuItem } from "@mui/material";
import { v4 } from "uuid";

import MoreVertIcon from '@mui/icons-material/MoreVert';
import { ActionWrapper, ActionWrapperProps } from "../../components/ActionsList";


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


const MenuItemComponent: React.FC<ActionWrapperProps> = (props) => {

  return (
    <ActionWrapper {...props}>
      {/* @ts-ignore */}
      <MenuItem key={props.action.label}
                size="small"
                style={{fontSize: 10, color: "white"}}>
        {props.action.label}
      </MenuItem>
    </ActionWrapper>
  )
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
    const availableActions = cardConfig.actions

    const [innerCardId, setInnerCardId] = React.useState(v4());
    const [anchorEl, setAnchorEl] = React.useState(null);
    const isContextOpened = Boolean(anchorEl);

    // const [callbackProps, setCallbackProps] = React.useState({});


    // React.useEffect(() => await {
      
    // }, callbackProps)

    const handleClickContextMenu = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleCloseContextMenu = () => {
      setAnchorEl(null);
    };

    // вынести в хук, перенести хук в actions
    const MenuItems= React.useMemo(
      () => {
        return (availableActions.map((action) => {return (
          // @ts-ignore
          <MenuItemComponent
            key={action.operationId}
            action={action}
            handleCloseContextMenu={handleCloseContextMenu}
            outerProps={outerProps}
            parentProps={cardConfig}
            />
        )}))
      }, []
    )

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
          <IconButton
              size="small"
              aria-label="more"
              id={`price-list-button-${innerCardId}`}
              aria-controls={isContextOpened ? `price-list-button-${innerCardId}` : undefined}
              aria-expanded={isContextOpened ? 'true' : undefined}
              aria-haspopup="true"
              onClick={handleClickContextMenu}>
              <MoreVertIcon/>
            </IconButton>
            <Menu
              id={`price-list-button-menu-${innerCardId}`}
              MenuListProps={{
                'aria-labelledby': `price-list-button-${innerCardId}`,
              }}
              anchorEl={anchorEl}
              open={isContextOpened}
              onClose={handleCloseContextMenu}
              slotProps={{
                paper: {
                  style: {
                    maxHeight: 48 * 4.5,
                    width: '28ch',
                  },
                },
              }}
            >
              {MenuItems}
            </Menu>
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