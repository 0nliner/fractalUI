import React, { forwardRef } from "react";
import { ContentAdapterProps, PageConfig } from "./types";
import { Search } from "../components/search";
import ReactDOM from "react-dom";
import PageWrapper from "../components/PageWrapper";
import { dataModifier } from "../components/ActionsList/utils";
import { RecoilState, useSetRecoilState, atom, useRecoilState } from "recoil";
import { useAPIActionFromOperationId } from "./utils";


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

// основной блок отображения данных, совмещает 
// в себе базовую логику для запроса и итерирования страниц
// любой компонент, который будет обёрнут вокруг этот 
export const DefaultContentPort: React.FC<DefaultContentPortProps> = forwardRef((props, ref) => {
    const [pagination, setPagination] = React.useState<any>({
        pageIndex: 0,
        pageSize: 10,
        });

    const newInjectionValues = props.injectionValues || {};
    const [objects, setObjects] = React.useState<any[]>([]);
    const [globalFilter, setGlobalFilter] = React.useState<string>('');
    const [isLoading, setIsLoading] = React.useState(false);
    const [isRefetching, setIsRefetching] = React.useState(false);

    const filterAction = useAPIActionFromOperationId(props.filterAction.operationId);

    const portDataAtom = props.filterAction?.dataAtom;
    const state = useRecoilState<any>(portDataAtom);
    const setState = useSetRecoilState<any>(portDataAtom);

    const portFilterAtom = props.filterAction?.filterAtom;
    const [filterPayload, setFilterPayload] = portFilterAtom ? useRecoilState<any>(portFilterAtom) : [{}, undefined];

    const actionsBlock = React.useMemo(() => {
        if (!props.actionsListBlock) {
            return null;
        }
        return (
            // @ts-ignore
            <props.actionsListBlock.Component injectionValues={newInjectionValues} isVertical={false} blocks={props.actionsListBlock.blocks}/>
        )}, [props.injectionValues]);

    const contentAdapterProps = {
        objects,
        setObjects,filterPayload,
        portDataAtom,
        pagination,
        setPagination,
        isLoading,
        setIsLoading,
        isRefetching,
        setIsRefetching,
        globalFilter,
        setGlobalFilter
    }

    React.useEffect(()=>{
    const fetchData = async () => {
        if (!state.length) {
        setIsLoading(true);
        } else {
        setIsRefetching(true);
        }
        
        let objectsData = null;
        let payload = filterPayload || {};

        if (props.filterAction.usePagination) {
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
        setState(objectsData.data)
    }
    // если указан api метод для получения данных - зарашиваем данные с сервака
    if (props.filterAction?.operationId) {
        fetchData()
        setIsLoading(false);
        setIsRefetching(false);
    }
    // в случае, когда мы не указываем id операции, предполагается, 
    // что данные мы берём при помощи экстракторов данных
    else if (!props.filterAction?.operationId && Boolean(props.filterAction?.dataExtractors)) {
       let data = [];
       // @ts-ignore
       data = dataModifier({action: props.filterAction, data: data, props: {...contentAdapterProps, ...props}});
       setObjects(data);
       if (setState) {setState(data)}
    }
    }, [pagination.pageIndex, pagination.pageSize, globalFilter, filterPayload])


    // вызываем фабрику, собираем компонент
    // console.log("ContentAdapter injection values", newInjectionValues)
    // @ts-ignore
    const factoryResult = props.ContentAdapter({...contentAdapterProps, ...props})
    const ContentAdapterComponent = factoryResult.Component

    return (
        <div style={{display: "flex", flexDirection: "column", gap:10}}>
            {props.filterAction?.searchConfig?.showSearch && document.getElementById("headerSearchPortalRoot") &&
            ReactDOM.createPortal(
                <Search onSubmit={setGlobalFilter}
                        filterAction={props.filterAction.searchConfig?.showSearchForm&&props.filterAction}
                        // @ts-ignore
                        portAtom={portDataAtom}
                        />,
                document.getElementById("headerSearchPortalRoot"))
            }
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