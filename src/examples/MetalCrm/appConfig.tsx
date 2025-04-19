// @ts-nocheck
import { Add, Autorenew, Business, Delete, EditNote, Factory, PrecisionManufacturing, Search, Start, Update } from "@mui/icons-material";
import { AppConfig } from "../../contentWrappers/types";
import { MinimalisticActionsList } from "../../components/ActionsList";
import { ParsingConfigurator } from "./ParsingConfigurator";

import Logo from "./assets/logo.svg?react";


import { atom } from 'recoil';
import { ParsingConfigurationField, RangeInputWidget, SelectProductTypeField, SelectSteelMarkField, SelectVendorField, Sizes } from "./fields";

const ParsingStatus = (props) => {
    const isParsed = props.row.original.parsed
    if (isParsed) {
        return (
            <div style={{borderRadius: "100px", width: "10px", height: "10px", backgroundColor: "rgb(107 189 63)"}}></div>
        )
    }
    else {
        return (
            <div style={{borderRadius: "100px", width: "10px", height: "10px", backgroundColor: "#c74040"}}></div>
        )
    }
}


const productsVendorsAtom = atom({
    key: "productsVendors",
    default: []})

const productsPositionsAtom = atom({
  key: "productsPositions",
  default: []  
})

const productsFilterAtom = atom({
    key: "productsFilterPayload",
    default: {}})

const vendorsAtom = atom({key: "vendors", default: []})
const vendorsFilterAtom = atom({key: "vendorsFilterAtom", default: {}})
const documentNamesAtom = atom({key: "documentNames", default: []})


export const MetallCRMConfig: AppConfig = {
    isAuto: true,
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
                        actionType: "link",
                        icon: <Search />,
                        label: "Изделия",
                        link: "/products"
                    },
                    {
                        actionType: "link",
                        icon: <Factory/>,
                        label: "Вендоры",
                        link: "/vendors"
                    },
                ]
            }
        ]},
    brandingConfig: {
        logoText: "MetalMarketHub",
        logoIcon: <Logo style={{height: 50, width: 50, fill: "rgba(62, 99, 90, 1)"}}/>
    },
    authConfig: {
        authRequired: false
    },
    pagesConfig: [
        {
            pageAlias: "products",
            pageName: "Изделия",
            pageURI: "/products",
            pageIcon: <Business/>,
            filterAction: {
                actionType: "form",
                operationId: "search",
                dataAtom: productsVendorsAtom,
                filterAtom: productsFilterAtom,
                usePagination: false,
                asModal: true,
                formUISchema: {
                  "ui:title": "Фильтация позиций",
                  "vendor_id": {
                    "ui:title": "Поставщик",
                    "ui:field": "SelectVendorField"
                  },
                  "vendor": {
                    "ui:widget": "hidden"
                  },
                  "type": {
                    "ui:title": "Тип изделия",
                    "ui:field": "SelectProductTypeField"
                  },
                  "steel_mark": {
                    "ui:title": "Марка металла",
                    "ui:field": "SelectSteelMarkField"
                  },
                  "length": {
                    "ui:title": "Длина",
                    "ui:field": "RangeInputWidget",
                  },
                  "width": {
                    "ui:title": "Ширина",
                    "ui:field": "RangeInputWidget"
                  },
                  "thickness": {
                    "ui:title": "Толщина",
                    "ui:field": "RangeInputWidget"
                   },
                   "diameter": {
                    "ui:title": "Диаметр",
                    "ui:field": "RangeInputWidget"
                   },
                   "height": {
                    "ui:title": "Высота",
                    "ui:field": "RangeInputWidget"
                   }
                },
                fields: {
                    SelectVendorField,
                    RangeInputWidget,
                    SelectProductTypeField,
                    SelectSteelMarkField
                },
                overrides: {
                    "dropItem definitions.CoreMeasurmentRangeDTO.required": ["units"],
                    "definitions.CoreMeasurmentRangeDTO.properties.useFilter.default": false,
                    "definitions.CoreMeasurmentRangeDTO.properties.value.default": [0, 999999999],
                    "definitions.CoreLengthUnits.default": 'см',
                },
                searchConfig: {
                    showSearchForm: true,
                    showSearch: true,
                },
                dataExtractors: {
                    default: {
                        extractor: (props) => (props.formData?.formData ?? props.filterPayload),
                        payloadModifier: ({payload, result, props}) => (result ?{body: result}: {body: {}})
                        }
                    }
            },
            vizualizationConfig: {
                vizualizationComponent: "Table",
                useSelection: false,
                withMinHeight: true,
                fieldsToShow: [
                    {alias: "Поставщик", fieldName: "vendor_title"},
                    {alias: "ID", fieldName: "id"}
                ],
                },
            nestedDataConfig: {
                filterAction: {
                    operationId: "searchPositions",
                    usePagination: true,
                    dataAtom: productsPositionsAtom,
                    filterAtom: productsFilterAtom,
                    dataExtractors: {
                        default: {
                            extractor: (props) => props.injectionValues.previousInjectionValues.row.original.id,
                            payloadModifier: ({payload, result, props}) => ({...payload, query: {page: payload.pagination.pageIndex+1, size: payload.pagination.pageSize}, body: {vendor_id: result}})
                            },
                        filters: {
                            extractor: (props) => props.formData?.formData ?? props.filterPayload,
                            payloadModifier: ({payload, result, props}) => ({...payload, body: {...payload.body, ...result}})
                        }
                    }
                },
                vizualizationConfig: {
                    vizualizationComponent: "Table",
                    enableTopToolbar: false,
                    useSelection: false,
                    fieldsToShow: [
                        {alias: "Тип продукции", fieldName: "type"},
                        {alias: "Марка металла", fieldName: "steel_mark"},
                        {alias: "Заявленное кол-во", fieldName: "quantity"},
                        {alias: "Цена за единицу", fieldName: "price"},
                        {alias: "Размеры", fieldName: "sizes", component: Sizes},
                        {alias: "ID", fieldName: "id"},
                    ]
                }
            },
        },
        {
            pageName: "Вендоры",
            pageURI: "/vendors",
            pageIcon: <Business/>,
            filterAction: {
                operationId: "searchVendors",
                usePagination: false,
                dataAtom: vendorsAtom,
                filterAtom: vendorsFilterAtom,
                dataExtractors: {
                    default: {
                        extractor: () => ({with_unique_documents_titles: true}),
                        payloadModifier: ({payload, result, props}) => ({query: result})
                        }
                    },
                searchConfig: {
                    showSearchForm: false,
                    showSearch: true,
                } 
            },
            vizualizationConfig: {
                vizualizationComponent: "Table",
                useSelection: false,
                fieldsToShow: [
                    {alias: "Название", fieldName: "title"},
                    {alias: "ID", fieldName: "id"}
                ]
            },
            nestedDataConfig: {
                filterAction: {  
                    usePagination: false,
                    filterAtom: atom({key: "filterDocuments", default: {}}),
                    dataAtom: documentNamesAtom,
                    dataExtractors: {
                        uniqueDocumentsTitles: {
                            extractor: (props) => props.injectionValues.previousInjectionValues.row.original.unique_document_titles,
                            payloadModifier: ({payload, result, props}) => (
                                result.map(entry => {
                                    let singleObj = {};
                                    singleObj.title = entry;
                                    return singleObj;
                                })
                            )}}
                },
                vizualizationConfig: {
                    vizualizationComponent: "Table",
                    enableTopToolbar: false,
                    useSelection: false,
                    fieldsToShow: [{alias: "Документ", fieldName: "title"}]
                },
                // отображение прайс листов
                nestedDataConfig: {
                    filterAction: {
                        operationId: "filterPricesLists",
                        usePagination: false,
                        dataAtom: atom({key: "pricesLists", default: []}),
                        filterAtom: atom({key: "filterPricesLists", default: {}}),
                        dataExtractors: {
                            title: {
                                extractor: (props) => props.injectionValues.previousInjectionValues.row.original.title,
                                payloadModifier: ({payload, result, props}) => (
                                    {query: {title: result}}
                                )},
                            vendorId: {
                                extractor: (props) => props.injectionValues.previousInjectionValues.previousInjectionValues.previousInjectionValues.row.original.id,
                                payloadModifier: ({payload, result, props}) => (
                                    {...payload, query: {...payload.query, vendor_id: result}}
                                )
                            }
                            }
                    },
                    vizualizationConfig: {
                        vizualizationComponent: "Table",
                        enableTopToolbar: false,
                        useSelection: false,
                        fieldsToShow: [
                            {alias: "ID", fieldName: "id"},
                            {alias: "Дата загрузки", fieldName: "date_time"},
                            {alias: "Обработано", fieldName: "parsed", component: ParsingStatus},
                        ]
                    },
                    rowActions: [
                        {
                            actionType: "default",
                            label: "Перезапустить парсинг",
                            icon: <Autorenew/>,
                            operationId: "runParsing",
                            dataExtractors: {
                                id: {
                                    extractor: (props) => props.injectionValues.row.original.id,
                                    payloadModifier: ({payload, result, props}) => ({query: {price_list_id: result}})
                                }
                            },
                            afterClick: ({notify, result, message, setMessage, showMessage, setShowMessage}) => {
                                if (result.status === 200) {
                                    setMessage('успешное обновление позиций прайс листа');
                                    setShowMessage(true);
                                    notify({
                                        content: {text: "успешное обновление позиций прайс листа"},
                                        status: "success"
                                    })
                                }
                            }
                        },
                        {
                            actionType: "link",
                            link: (props) => `/edit_price_list?price_list_id=${props.injectionValues.row.original.id}`,
                            label: "Обновить прайс лист",
                            icon: <Update/>,
                            operationId: "updateParsingConfiguration",
                        },
                        {
                            actionType: "default",
                            label: "Удалить прайс лист",
                            icon: <Delete/>,
                            operationId: "deletePriceList",
                            dataExtractors: {
                                id: {
                                    extractor: (props) => props.injectionValues.row.original.id,
                                    payloadModifier: ({payload, result, props}) => ({query: {id: result}})
                                }
                            },
                            afterClick: ({notify, result, message, setMessage, showMessage, setShowMessage}) => {
                                if (result.status === 200) {
                                    setMessage('Прайс лист удален');
                                    setShowMessage(true);
                                    notify({
                                        content: {text: "Прайс лист удален"},
                                        status: "success"
                                    })
                                }
                            }
                        },
                    ]
            }},
            actionsListBlock: {
                isVertical: false,
                position: "bottom",
                Component: MinimalisticActionsList,
                blocks: [
                    {
                        title: "default",
                        unpack: true,
                        actions: [
                            {
                                actionType: "form",
                                icon: <Add/>,
                                label: "Добавить нового поставщика",
                                operationId: "createVendor",
                                dataExtractors: {
                                    formData: {
                                        extractor: (props) => props.formData.formData,
                                        payloadModifier: ({payload, result, props}) => ({body: result})
                                    }
                                },
                                formUISchema: {
                                    "ui:title": "Добавить нового поставщика",
                                    "title": {
                                        "ui:title": "Название",
                                    },
                                    "websiteUrl": {
                                        "ui:title": "Сайт"
                                    },
                                    "city": {
                                        "ui:title": "Город"
                                    }
                                },
                                dataAtom: vendorsAtom,
                                afterClick: ({notify, result, message, setMessage, showMessage, setShowMessage, atomState, setAtomState}) => {
                                    if (result.status === 200) {
                                        setMessage('Поставщик успешно создан');
                                        setShowMessage(true);
                                        notify({
                                            content: {text: "Поставщик успешно создан"},
                                            status: "success"
                                        })
                                        setAtomState(data=>[...data, result.data])
                                    }
                                }
                            }]}
            ]},
            rowActions: [
                {
                    actionType: "link",
                    link: "/edit_price_list",
                    label: "Создать прайс лист",
                    icon: <EditNote/>
                },
                {
                    actionType: "overlay",
                    label: "Автоматизации",
                    icon: <PrecisionManufacturing/>,
                    overlayConfig:{
                            // pageName: "Автоматизация",
                            // pageURI: "/automation",
                            // pageIcon: <PrecisionManufacturing/>,
                            vizualizationConfig: {
                                vizualizationComponent: "Table",
                                enableTopToolbar: false,
                                useSelection: false,
                                fieldsToShow: [
                                    {alias: "Вид документов", fieldName: "document_name"},
                                    {alias: "ID", fieldName: "id"},
                                    // {alias: "Дата загрузки", fieldName: "date_time"},
                                    // {alias: "Обработано", fieldName: "parsed"},
                                ]
                            },
                            filterAction: {
                                operationId: "listDownloadingConfigurations",
                                usePagination: true,
                                searchConfig: {
                                    showSearch: false,
                                    showSearchForm: false
                                },
                                dataAtom: atom({key: "automations", default: []}),
                                filterAtom: atom({key: "automationsFilter", default: []}),
                                dataExtractors: {
                                    vendorId: {
                                        extractor: (props) => props.injectionValues.previousInjectionValues.injectionValues.row.original.id,
                                        payloadModifier: ({payload, result, props}) => ({query: {page: payload.pagination.pageIndex, size: payload.pagination.pageSize}, body: {vendor_id: result}})
                                    }
                                }
                            },                            
                            rowActions: [
                                {
                                    actionType: "default",
                                    icon: <Delete/>,
                                    label: "Удалить",
                                    operationId: "deleteDownloadingConfiguration",
                                    dataExtractors: {
                                        id: {
                                            extractor: (props) => props.injectionValues.row.original.id,
                                            payloadModifier: ({payload, result, props}) => ({body: {id: result}})
                                        },
                                    },
                                    afterClick: ({notify, result, message, setMessage, showMessage, setShowMessage}) => {
                                        if (result.status === 200) {
                                            setMessage('Автоматизация удалена');
                                            setShowMessage(true);
                                            notify({
                                                content: {text: "Автоматизация удалена"},
                                                status: "success"
                                            })
                                        }
                                    }
                                },
                                {
                                    actionType: "default",
                                    icon: <Start/>,
                                    label: "Принудительный запуск",
                                    operationId: "forceRun",
                                    dataExtractors: {
                                        id: {
                                            extractor: (props) => props.injectionValues.row.original.id,
                                            payloadModifier: ({payload, result, props}) => ({query: {pk: result}})
                                        },
                                    },
                                    afterClick: ({notify, result, message, setMessage, showMessage, setShowMessage}) => {
                                        if (result.status === 200) {
                                            setMessage('Произведен принудительный запуск автоматизации');
                                            setShowMessage(true);
                                            notify({
                                                content: {text: "Произведен принудительный запуск автоматизации"},
                                                status: "success"
                                            })
                                        }
                                    },
                                }
                                // TODO: сделать обновление конфигурации
                                // {
                                //     actionType: "form",
                                //     icon: <Edit/>,
                                //     label: "Редактировать",
                                //     operationId: "updateDownloadingConfiguration",
                                // }
                            ],
                            actionsListBlock: {
                                isVertical: false,
                                position: "bottom",
                                Component: MinimalisticActionsList,
                                blocks: [
                                    {
                                        title: "default",
                                        unpack: true,
                                        actions: [
                                            {
                                                actionType: "form",
                                                label: "Создать автоматизацию",
                                                operationId: "createDownloadingConfiguration",
                                                icon: <Add/>,
                                                dataExtractors: {
                                                    formData: {
                                                        extractor: (props) => props.formData.formData,
                                                        payloadModifier: ({payload, result, props}) => ({body: result})
                                                    }
                                                },
                                                afterClick: ({notify, result, message, setMessage, showMessage, setShowMessage}) => {
                                                    if (result.status === 200) {
                                                        setMessage('Автоматизация создана');
                                                        setShowMessage(true);
                                                        notify({
                                                            content: {text: "Поставщик удален"},
                                                            status: "success"
                                                        })
                                                    }
                                                },
                                                fields: {
                                                    ParsingConfigurationField,
                                                    SelectVendorField
                                                },
                                                formUISchema: {
                                                    "ui:title": "Создание автоматизации",
                                                    "vendor_id": {
                                                        // TODO: пока сделать поле с поиском по названию вендора
                                                        "ui:title": "Поставщик",
                                                        "ui:field": "SelectVendorField"
                                                    },
                                                    "enabled": {
                                                        "ui:title": "Включить ли автоматизацию ?",
                                                        // "ui:widget": "hidden",
                                                    },
                                                    "document_name": {
                                                        "ui:title": "название документа",
                                                        "ui:help": "название документа",
                                                    },
                                                    "puppteer_configuration": {
                                                        "ui:title": "Файл автоматизации",
                                                        "ui:field": "ParsingConfigurationField",
                                                        // TODO: сделать файл загрузки json файла, при загрузке читать его и забирать json содержимое, превращать в строку
                                                    },
                                                    "interval": {
                                                        "ui:title": "Интервал через который происходит повторная загрузка",
                                                        "years": {
                                                            "ui:title": "Года"},
                                                        "days": {
                                                            "ui:title": "Дни"},                                                           
                                                        "time": {
                                                            "ui:title": "Время"}}}}
                                        ]
                                    }
                                ]
                            },
                            nestedDataConfig: {
                                filterAction: {
                                    dataAtom: atom({key: "jobs", default: []}),
                                    filterAtom: atom({key: "jobsFilter", default: {}}),
                                    usePagination: true,
                                    dataExtractors: {
                                        default: {
                                            extractor: (props) => props.injectionValues.previousInjectionValues.row.original.id,
                                            payloadModifier: ({payload, result, props}) => ({query: {page: payload.pagination.pageIndex, size: payload.pagination.pageSize}, body: {configuration_id: result}})
                                        }
                                    },
                                    operationId: "listJobs",
                                },
                                vizualizationConfig: {
                                    vizualizationComponent: "Table",
                                    useSelection: false,
                                    fieldsToShow: [
                                        {"alias": "ID", "fieldName": "id"},
                                        {"alias": "Статус", "fieldName": "status"},
                                        // {"alias": "ID конфигурации", "fieldName": "configuration_id"},
                                    ]
                                }
                            }
                    }
                },
                {
                    actionType: "default",
                    operationId: "deleteVendor",
                    icon: <Delete/>,
                    label: "Удалить",
                    dataExtractors: {
                        id: {
                            extractor: (props) => props.injectionValues.row.original.id,
                            payloadModifier: ({payload, result, props}) => ({query: {id_: result}})
                        }
                    },
                    dataAtom: vendorsAtom,
                    afterClick: ({notify, result, message, setMessage, showMessage, setShowMessage, atomState, setAtomState, props}) => {
                        if (result.status === 200) {
                            setMessage('Поставщик удален');
                            setShowMessage(true);
                            notify({
                                content: {text: "Поставщик удален"},
                                status: "success"
                            })
                            // пропсы пустые
                            setAtomState(state=>state.filter(vendor => vendor.id !== props.injectionValues.row.original.id))
                        }
                    }
                }
            ]
        },
        {
            pageName: "Редактирование прайс листа",
            filterAction: {
                dataAtom: atom({key: "priceListEditor", default: []}),
                filterAtom: atom({key: "filterPriceListEditor", default: []}),
            },
            pageURI: "/edit_price_list",
            pageIcon: <EditNote/>,
            PageComponent: ParsingConfigurator
        },
    ],
}