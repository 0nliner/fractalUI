import { Overrides } from '../autoforms/utils';
import React from 'react';
import { ActionsListProps } from '../components/ActionsList/MinimalisticActionsList';
import { Notification } from '../providers/notificationsProvider';
import { RecoilState } from 'recoil';


export type BrandingConfigConfig = {
    logoSrc?: string;
    logoIcon?: React.ReactNode; 
    logoText?: string;
}


// хрень, которая из пропсов можт доставать значения и укладывать в параметры запроса 
// слева хрень, которая достаёт значение, справа кладёт данные в пэйлоад
// как временная мера, прокидываются определённые значения в пропсы компонента, который вызывает экшен
// в херне которая кладёт значение - аргумент - это пропсы компонента + херня, 
// которую отдала первая функция экстрактора
export type DataExtractor = {
    extractor: (props: any)=>any
    payloadModifier: (args: {props: object; payload: object; result: any}) => any
}

export type AfterActionClickProps = {
    notify: (notification: Notification) => void;
    result: any;
    message: string;
    setMessage: (message: string) => void;
    showMessage: boolean;
    setShowMessage: (showMessage: boolean) => void;
    atomState: RecoilState<any>;
    setAtomState: (atomState: RecoilState<any>) => void;
    props: object
}


export type Action = {
    operationId?: string;
    onClickAction?: string;

    // параметры для генерации формы 
    formUISchema?: object;
    // кастомные поля формы
    fields?: Record<string, React.FC>;
    // параметры для изменения схемы формы
    overrides?: object;

    icon?: React.ReactNode;
    label?: string;
    // TODO: дефолтное значение пока нигде не проставляется,
    // можно просто поставить overlay, еси описывается параметр overlayConfig
    actionType?: "default" | "overlay" | "form" | "link" | "setContent";
    link?: string | ((props: any) => string);
    // действие может вызывать отрисоку оверлея
    // объекты оверлея не связанные друг с другом. они рендерятся 
    // при помощи реактовских порталов, при рендере передавая пропсы, 
    // из за этого в пропсах может накопиться большая какашка, с этим нужно что-то делать
    overlayConfig?: PageConfig;
    dataAtom?: RecoilState<any>;
    filterAtom?: RecoilState<any>;
    // механизмы связи данных 
    dataExtractors?: Record<string, DataExtractor>;


    asModal?: boolean;

    // действие, которое будет вызвано после 
    // выполнения основной части действия
    afterClick?: (props: AfterActionClickProps) => void;
};


export type FilterAction = {
    searchConfig?: {
        showSearchForm: boolean;
        showSearch: boolean;
    }
    usePagination?: boolean;
} & Action;

export type AliasedField = {
    alias: string;
    fieldName: string;
    display?: boolean;
    asImage?: boolean;
    component?: React.FC<any>;
}

export type CardField = {
    label: string;
    Component?: React.FC<any>;
    getOptionLabel?: (option: any) => string
}

export type CardConfig = {
    fields: Record<string, CardField>;
    actions: Action[];
    Component: React.FC<any>;
}

// TODO: сейчас для прототипа все типы смёрджены, 
// их нужно будет декомпозировать
export type PageVizualizationConfig = {
    vizualizationComponent: "Table" | "XLSXTable" | "Feed";
    // настройки отображения контента для таблиц
    fieldsToShow?: AliasedField[];
    useSelection?: boolean;
    enableTopToolbar?: boolean;
    withMinHeight?: boolean;
    // актуально только для типа отображения feed
    // TODO:
    cardConfig?: CardConfig
}


export type PageConfig = {
    // используется для динамической генерации состояния recoil
    pageAlias?: string;
    // атом для работы с данными
    atom?: RecoilState<any>;
    // имя страницы
    pageName?: string;
    pageURI?: string;
    // иконка для отображения в навигации
    pageIcon?: React.ReactNode;
    vizualizationConfig?: PageVizualizationConfig;
    actionsListBlock?: ActionsListProps;
    nestedDataConfig?: PageConfig;

    // стандартные операции
    filterAction?: FilterAction;
    
    PageComponent?: React.FC;
    // retrieveAction?: Action;

    // список с operation id доп действий на стоку
    rowActions?: Action[];
    // список действий на multiselect
    multiselectActions?: Action[];
}

export type AuthConfig = {
    authRequired: boolean,
    operationId?: string,
    UISchema?: object,
    fields?: object,
    overrides?: Overrides;
    onSubmit?: (formData: object) => object
}

export type AppConfig = {
    isAuto: true;
    navigation: ActionsListProps;
    brandingConfig: BrandingConfigConfig;
    pagesConfig: PageConfig[];
    authConfig?: AuthConfig;
}



export type ContentAdapterProps = {
    objects: any[],
    setObjects: React.Dispatch<React.SetStateAction<any[]>>,
    pagination: any,
    setPagination: React.Dispatch<React.SetStateAction<any>>,
    formOpened: boolean,
    setFormOpened: React.Dispatch<React.SetStateAction<boolean>>,
    isLoading: boolean,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
    isRefetching: boolean,
    setIsRefetching: React.Dispatch<React.SetStateAction<boolean>>,
    globalFilter: string,
    setGlobalFilter: React.Dispatch<React.SetStateAction<string>>,

    injectionValues: Record<string, any>
} & PageConfig;



// страницы собираются при помощи гридов
// каждый компонент на странице - результат вызова хука, который генерирует компонент


export interface ContentBlockProps {
    itemActions?: Action[];

}