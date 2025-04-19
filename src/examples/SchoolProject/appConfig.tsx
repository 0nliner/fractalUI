// @ts-nocheck
import AppLogo from "./assets/cookIcon.svg?react";


import { BarChart, Dashboard, Delete, Description, Logout, ShoppingCart } from "@mui/icons-material";
import { AppConfig } from "../../contentWrappers/types";
import { LoginFormSettings } from "./forms/loginForm";
import dayjs from 'dayjs';
import React from "react";
import { MinimalisticActionsList } from "../../components/ActionsList";
import { studentsPageConfig } from "./configs/studentsPage";


const ImageFieldComponent: React.FC<any> = (props) => {
    return props.image_data?
        <img
        src={`${props.image_data}`}
        alt="Decoded Base64"
        style={{ width: '100px', height: '100px', border: "10px" }}
        />:
        <div
            style={{
                width: '70px',
                height: '70px',
                backgroundColor: 'gray',
                border: "10px",
                borderRadius: "100px"
            }}
            />
}


const SchoolProjectExamplePropsValues: AppConfig = {
    isAuto: true,
    brandingConfig: {
        logoText: "Столовая",
        logoIcon: <AppLogo style={{width: '2em', height: "2em", color: "gray"}}/>
    },
    navigation: {
        position: "left",
        Component: MinimalisticActionsList,
        isVertical: true,
        blocks: [
            {
                title: "default",
                unpack: true,
                actions: [
                    {
                        icon: <BarChart/>,
                        label: "Отчёты",
                        actionType: "link",
                        link: "/reports",
                        // onClickAction: () => window.location = "/reports",
                    },
                    {
                        icon: <Description/>,
                        label: "Ученики",
                        actionType: "link",
                        link: "/students",
                        // onClickAction: () => window.location = "/students",
                    },
                    {
                        icon: <Dashboard/>,
                        label: "журнал",
                        actionType: "link",
                        link: "/journal",
                        // onClickAction: () => window.location = "/journal",
                    },
                    {
                        icon: <ShoppingCart/>,
                        label: "раздача",
                        actionType: "link",
                        link: "/distribution",
                        // onClickAction: () => window.location = "/distribution",
                    },
                    { 
                        label: "выход из аккаунта",
                        icon: <Logout/>,
                        onClickAction: (exit) => {
                            exit()
                    }},
                ]
            }
        ]
    },
    authConfig: {
        authRequired: true,
        ...LoginFormSettings
    },
    pagesConfig: [
        {
            filterAction: {
                operationId: "generate_reports",
                formUISchema: {
                    "ui:title": "Настройка отчёта",
                    "interval_start": {"ui:title": "начало периода"},
                    "interval_end": {"ui:title": "конец периода"},
                    "meal_time__in": {"ui:title": "вид приёма пищи"},
                    "menu__in": {"ui:title": "категория питания"}
                },
                usePagination: false,
                searchConfig: {
                    showSearchForm: true,
                    showSearch: true,
                }
            },
            pageIcon: <Description />,
            pageName: "Отчёты",
            pageURI: "/reports",
            vizualizationConfig: {
                vizualizationComponent: "XLSXTable",
                fieldsToShow: [
                    {alias: "id", fieldName: "id"},
                ]}
        },
        studentsPageConfig,
        {
            pageName: "Журнал",
            pageURI: "/journal",
            filterAction: {
                operationId: "journalLogs",
                usePagination: false,
                useSelection: false,
                dataExtractors: {
                    "general": {
                        extractor: (props) => null,
                        payloadModifier: (args) => {
                            return {...args.payload, body: {}}
                        }
                    }
                }
            },
            vizualizationConfig: {
                vizualizationComponent: "Table",
                fieldsToShow: [
                    {alias: "id", fieldName: "id"},
                    // {alias: "разрешено ли", fieldName: "id"},
                ]
            }
        },
        {
            pageName: "Раздача",
            pageURI: "/distribution",
            filterAction: {
                operationId: "getDistributionLogs",
                usePagination: false,
                dataExtractors: {
                    "general": {
                        extractor: (props) => null,
                        payloadModifier: (args) => {
                            return {...args.payload, query: {limit: 30}}
                        }
                    }
                }
            },
            vizualizationConfig: {
                vizualizationComponent: "Table",
                useSelection: false,
                fieldsToShow: [
                    {alias: "Фото", fieldName: "entrance_datetime", component: ImageFieldComponent},
                    {alias: "Время", fieldName: "entrance_datetime", component: (props: any)=>dayjs(props.value).format('HH:mm  YYYY.MM.DD')},
                    {alias: "Разрешено", fieldName: "is_allowed", component: (props)=>{return props.renderedCellValue?"Да":"Нет"}},
                    {alias: "Имя", fieldName: "first_name"},
                    {alias: "Приём пиши", fieldName: "meal_alias"},
                    {alias: "Тип питания", fieldName: "menu_alias"},
                    {alias: "ID", fieldName: "log_id"},
                    // {alias: "разрешено ли", fieldName: "id"},
                ]
            }
        }
    ]
}

export {SchoolProjectExamplePropsValues};
