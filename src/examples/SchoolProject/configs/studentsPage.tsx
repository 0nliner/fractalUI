// @ts-nocheck
import { Add, BarChart, CloudSync, Delete, PersonAdd } from "@mui/icons-material"
import { MinimalisticActionsList } from "../../../components/ActionsList"
import MealPlanIcon from "../assets/mealPlanIcon.svg?react";
import { PageConfig } from "../../../contentWrappers/types";
import { MealTimeAliasAutocompleteField, MenuAutocompleteField, StudentAutocompleteField } from "../forms/createMealForm";
import { CardArrayField } from "../../../contentWrappers/factories/FeedFactory";


export const studentsPageConfig: PageConfig = {
    pageIcon: <BarChart/>,
    pageName: "Ученики",
    pageURI: "/students",
    actionsListBlock: {
        position: "bottom",
        isVertical: false,
        Component: MinimalisticActionsList,
        blocks: [
            {
                title: "default",
                unpack: true,
                actions: [
                    {
                        operationId: "addStudentByCardId",
                        icon: <PersonAdd/>,
                        actionType: "form",
                        label: "Добавить ученика по Id карты",
                        formUISchema: {
                            "ui:title": "Добавить ученика по Id карты"
                        }
                    },
                    {
                        actionType: "form",
                        operationId: "createStudentsMealPlan",
                        dataExtractors: {
                            formData: {
                                extractor: (props) => props.formData,
                                payloadModifier: ({payload, result, props}) => ({body: result})
                            }
                        },
                        icon: <Add/>,
                        label: "Добавить план питания",
                        fields: {
                            StudentAutocompleteField,
                            MealTimeAliasAutocompleteField,
                            MenuAutocompleteField
                        },
                        formUISchema: 
                            {
                                "ui:order": ["students_ids", "allowed_on_this_interval", "period_start", "period_end", "menu_id", "planned_day_meals", "priority"], 
                                "ui:title": "Создание плана питания",
                                "students_ids": {
                                  "ui:title": "Студенты",
                                  "ui:field": "StudentAutocompleteField",
                                },
                                "allowed_on_this_interval": {
                                  "ui:title": "Разрешено ли есть в этом интервале"
                                },
                                "period_start": {
                                  "ui:title": "Начало периода"
                                },
                                "period_end": {
                                  "ui:title": "Конец периода"
                                },
                                "menu_id": {
                                  "ui:title": "меню",
                                  "ui:field": "MenuAutocompleteField"
                                },
                                "planned_day_meals": {
                                  "ui:title": "Запланированные дневные приемы пищи",
                                  "items": {
                                    "alias": {
                                      "ui:title": "Приём пищи",
                                      "ui:field": "MealTimeAliasAutocompleteField"
                                    },
                                    "time_from": {
                                      "ui:title": "Время начала"
                                    },
                                    "time_to": {
                                      "ui:title": "Время окончания"
                                    },
                                    "exclusions": {
                                      "ui:title": "Исключения"
                                    }
                                  }
                                },
                                "priority": {
                                  "ui:title": "Приоритет",
                                  "ui:widget": "hidden",
                                }
                        }
                    },
                    {
                        actionType: "default",
                        operationId: "syncUsers",
                        icon: <CloudSync/>,
                        label: "Синхронизация пользователей",
                    } 
                ]
        }]
    },
    filterAction: {
        operationId: "filterStudents",
        formUISchema:  {
            "ui:title": "фильтрация пользователей",
            "id": {
                "ui:title": "Id",
                "ui:help": "Id пользователя",
            },
            "strazh_id": {
                "ui:title": "страж Id",
                "ui:help": "Id в системе страж",
            }
        },
        searchConfig: {
            showSearchForm: true,
            showSearch: true,
        },
        usePagination: true,
        dataExtractors: {
            "name_substring": {
                extractor: (props) => props.globalFilter,
                payloadModifier: (args) => {
                    return {...args.payload, body: {...args.payload.body, name_substring: typeof args.result === 'string' && args.result.length > 0 ? args.result : undefined}}
                },
            }
        }
    },
    rowActions: [
        {
            actionType: "overlay",
            icon: <MealPlanIcon style={{width: 27, height: 27, fill: "white"}}/>,
            label: "Планы питания",
            overlayConfig: {
                // actionsListBlock: {
                //     position: "bottom",
                //     isVertical: false,
                //     Component: MinimalisticActionsList,
                //     blocks: [
                //         {
                //             // update_meal_plan
                //             title: "default",
                //             unpack: true,
                //             actions: [
                                  
                //             ]
                //         }
                //     ]  
                // },
                filterAction: {
                    operationId: "getUserMealPlans",
                    dataExtractors: {
                        "id": {
                            extractor: (props) => props.injectionValues.row.original.inner_id,
                            payloadModifier: (args) => {
                                return {...args.payload, query: {...args.payload.query, user_id: args.result}}
                            },
                        }
                    }
                },
                vizualizationConfig: {
                    vizualizationComponent: "Feed",
                    cardConfig: {
                        actions: [
                            {
                                operationId: "soft_delete_user_meal_plan",
                                label: "Удалить"
                            },
                            {
                                operationId: "update_meal_plan",
                                label: "Обновить",
                                actionType: "form",
                                fields: {
                                    MenuAutocompleteField
                                },
                                formUISchema: {
                                    "ui:title": "Обновление плана питания",
                                    "allowed_on_this_interval": {
                                        "ui:title": "Разрешено ли есть в этом интервале"
                                    },
                                    "period_start": {
                                        "ui:title": "Начало периода"
                                    },
                                    "period_end": {
                                        "ui:title": "Конец периода",
                                    },
                                    "priority": {
                                        "ui:widget": "hidden",
                                    },
                                    "menu": {
                                        "ui:title": "Меню",
                                        "ui:field": "MenuAutocompleteField"
                                    }
                                }
                            },
                        ],
                        fields: {
                            "period_start": { label: "От"},
                            "period_end": { label: "До"},
                            "allowed_on_this_interval": { label: "разрешено ли питание"},
                            "menu": { label: "разрешено ли питание"},
                            "planned_day_meals": {
                                label: "запланированные приёмы пищи",
                                Component: (props: any) => <CardArrayField {...props}/>,
                                getOptionLabel: (option) => option.title
                            },
                        }
                    }
                }
            }
        },
        {
            operationId: "studentSoftDelete",
            icon: <Delete/>,
            label: "Удалить"
        },  
    ],
    vizualizationConfig: {
        vizualizationComponent: "Table",
        fieldsToShow: [
            {alias: "Фамилия", fieldName: "lastname"},
            {alias: "Имя", fieldName: "firstname"},
            {alias: "Отчество", fieldName: "secondname"},
            {alias: "Класс", fieldName: "class"},
            {alias: "id", fieldName: "inner_id"},
            {alias: "card_id", fieldName: "card_id"},
            {alias: "outer_id", fieldName: "scudId"},
        ]
    }
}