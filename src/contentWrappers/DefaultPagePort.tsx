import React, { forwardRef, useState } from "react";
import { ContentAdapterProps, PageConfig } from "./types";
import { Search } from "../components/search";
import ReactDOM from "react-dom";
import PageWrapper from "../components/PageWrapper";
import { dataModifier } from "../components/ActionsList/utils";
import { RecoilState, useSetRecoilState, atom, useRecoilState } from "recoil";
import { useAPIActionFromOperationId } from "./utils";
import { useSearchParams } from "react-router-dom";


export type FactoryResult = {
    Component: React.FC<ContentAdapterProps>
    // в типизации могут быть любы пропсы адаптеров 
    // на экстра пропс, эти типы нужно прописыать
    //  в соответствующих адаптерах, через или сделать
    //  новый тип, заанотировать тут extraProps
    extraProps?: object
} 

export type DefaultContentPortProps = PageConfig & {
    ContentAdapter: (props: ContentAdapterProps) => FactoryResult;
    injectionValues?: Record<string, any>
    previousInjectionValues?: Record<string, any>
};

export type SearchProps = {

} 


export const useSearchManager = ({}: SearchProps) => {
    const [filterPayload, setFilterPayload] = useState({});
    const [globalFilter, setGlobalFilter] = React.useState<string>('');

    return {
        filterPayload,
        setFilterPayload,
        globalFilter,
        setGlobalFilter
    }
}

export const useContentManager = (filterAction) => {
    const [objects, setObjects] = React.useState<any[]>([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [isRefetching, setIsRefetching] = React.useState(false);
    const [pagination, setPagination] = React.useState<any>({
        pageIndex: 0,
        pageSize: 10,
        });

    const searchManager = useSearchManager({});

    // отправляет запрос на сервер, получает данные, сохраняет их в хранилище
    const fetchData = async () => {
        if (!objects.length) {
            setIsLoading(true);
        } else {
            setIsRefetching(true);
        }
        
        let objectsData = null;
        let payload = searchManager.filterPayload || {};

        // 
        if (filterAction.usePagination) {
            payload = {
                query: {
                        page: pagination.pageIndex+1,
                        size: pagination.pageSize
                }};
        }

        // достаём данные при помощи data extractors, изменяем payload
        // @ts-ignore
        payload = dataModifier({action: props.filterAction, data: {...contentAdapterProps, ...props}});
        objectsData = await filterAction(payload);
        setObjects(objectsData.data);
        // setState(objectsData.data)
    }

    const loadData = () => {
        // если указан api метод для получения данных - зарашиваем данные с сервака
        if (filterAction?.operationId) {
            fetchData()
            setIsLoading(false);
            setIsRefetching(false);
        }

        // в случае, когда мы не указываем id операции, предполагается, 
        // что данные мы берём при помощи экстракторов данных
        else if (!filterAction?.operationId && Boolean(filterAction?.dataExtractors)) {
        let data = [];
        // @ts-ignore
        data = dataModifier({action: props.filterAction, data: data, props: {...contentAdapterProps, ...props}});
        setObjects(data);
        // if (setState) {setState(data)}
        }
    }


    return {
        objects, setObjects,
        isLoading, setIsLoading,
        isRefetching, setIsRefetching,
        pagination, setPagination,
        filterPayload: searchManager.filterPayload, setFilterPayload: searchManager.setFilterPayload,
        globalFilter: searchManager.globalFilter, setGloblaFilter: searchManager.setGlobalFilter,
        loadData
    };
}

// основной блок отображения данных, совмещает 
// в себе базовую логику для запроса и итерирования страниц
// любой компонент, который будет обёрнут вокруг этот 
export const DefaultContentPort: React.FC<DefaultContentPortProps> = forwardRef((props, ref) => {
    const newInjectionValues = props.injectionValues || {};
    // const filterAction = useAPIActionFromOperationId(props.filterAction.operationId);
    const contentManager = useContentManager(props?.filterAction?.operationId);

    const actionsBlock = React.useMemo(() => {
        if (!props.actionsListBlock) {
            return null;
        }
        return (
            // @ts-ignore
            <props.actionsListBlock.Component injectionValues={newInjectionValues} isVertical={false} blocks={props.actionsListBlock.blocks}/>
        )}, [props.injectionValues]);


    const contentAdapterProps = {
        pagination: contentManager.pagination,
        setPagination: contentManager.setPagination,
        isLoading: contentManager.isLoading,
        setIsLoading: contentManager.setIsLoading,
        isRefetching: contentManager.isRefetching,
        setIsRefetching: contentManager.setIsRefetching,
        globalFilter: contentManager.globalFilter,
        setGlobalFilter: contentManager.setGloblaFilter
    }

    React.useEffect(()=>{
        contentManager.loadData()
    }, [contentManager.pagination.pageIndex, contentManager.pagination.pageSize, contentManager.globalFilter, contentManager.filterPayload])


    // вызываем фабрику, собираем компонент
    // @ts-ignore
    const factoryResult = props.ContentAdapter({...contentAdapterProps, ...props})
    const ContentAdapterComponent = factoryResult.Component

    return (
        <div style={{display: "flex", flexDirection: "column", gap:10}}>
            {/* {props.filterAction?.searchConfig?.showSearch && document.getElementById("headerSearchPortalRoot") &&
            ReactDOM.createPortal(
                <Search onSubmit={setGlobalFilter}
                        filterAction={props.filterAction.searchConfig?.showSearchForm&&props.filterAction}
                        // @ts-ignore
                        portAtom={portDataAtom}
                        />,
                document.getElementById("headerSearchPortalRoot"))
            } */}
            <PageWrapper>
                {/* @ts-ignore */}
                <ContentAdapterComponent
                        {...contentAdapterProps}
                        {...props}
                        injectionValues={newInjectionValues}
                        {...factoryResult.extraProps} />
            </PageWrapper>
            <div style={{display: "flex", justifyContent: "center", zIndex: 10}}>
                {actionsBlock}
            </div>
        </div>
    );
})