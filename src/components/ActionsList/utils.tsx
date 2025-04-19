import React, { useCallback, useContext } from "react";
import { useFormFromOperationID } from "../../autoforms/utils";
import { Action } from "../../contentWrappers/types";
import { generateContentApapterComponent, getAPIActionFromOperationId } from "../../contentWrappers/utils";
import { useNavigate } from "react-router-dom";
import { NotificationContext } from "../../providers/notificationsProvider";
import { OverlayContext } from "../../providers/overlayProvider";
import { ActionWrapper, ActionWrapperProps } from ".";
import { useRecoilState, useSetRecoilState } from "recoil";


export type DataModifierProps = {
    action: Action;
    payload: object;
    // данные прокидываемые компонентом
    data: object;
    // пропсы компонента
    props: any;
} 

export const dataModifier = (props: DataModifierProps) => {
    if (props.action.dataExtractors) {
        let payloadCopy = {...props.data};
        Object.values(props.action.dataExtractors).forEach(({ extractor, payloadModifier }) => {
            const res = extractor({...props.data, ...props.props});
            payloadCopy = payloadModifier({ props: props.payload, result: res, payload: payloadCopy });
        });
        return payloadCopy
    }
}


export const useCallAction = (action: Action, outerProps: any, props: any) => {
    const {notify} = useContext(NotificationContext);
    const {setOverlay} = useContext(OverlayContext);
    const [message, setMessage] = React.useState<string>(""); 
    const [showMessage, setShowMessage] = React.useState<boolean>(false);

    let filterPayload = {}
    let setFilterPayload = null;
    let setState;

    if (action.dataAtom && action.filterAtom) {
        setState = useSetRecoilState(action.dataAtom);

        const portFilterAtom = action.filterAtom;
        [filterPayload, setFilterPayload] = useRecoilState(portFilterAtom);
    }

    let atomState;
    let setAtomState;
    if (action.dataAtom) {
        [atomState, setAtomState] = useRecoilState(action.dataAtom);
    }

    let GeneratedFormComponent = null;
    if (action.actionType === "form") {
        GeneratedFormComponent = useFormFromOperationID(
            action,
            async (formData?: any) => {
                setFilterPayload?setFilterPayload(formData.formData):null;
                await sendRequest({...props, ...outerProps, formData});
            }
        );
    }

    const navigate = useNavigate();

    // Логика отправки запроса
    const sendRequest = useCallback(
        async (injectionValues: object) => {
            const handleClick = getAPIActionFromOperationId(action.operationId);  
            let payload = dataModifier({action, data: injectionValues, payload: {}, props: {...props, ...outerProps}});
            const result = await handleClick(payload);
            action.afterClick && action.afterClick({ notify, result, message, setMessage, showMessage, setShowMessage, atomState, setAtomState, props});
            // setState?setState(result):null;
        },
        [atomState, props]
    );

    const callAction = useCallback(
        async (injectionValues: object, previousInjectionValues: object) => {
            let handler;
            // TODO: спорная конструкия
            const combinedInjectionValues = {injectionValues: { previousInjectionValues: previousInjectionValues, ...injectionValues}};

            switch (action.actionType) {
                case "form":
                    // console.log('ffform', GeneratedFormComponent);
                    break;

                case "link":
                    let navLink = undefined;
                    if (typeof action.link === "string") {
                      navLink = action.link;
                    }
                    else {
                      navLink = action.link(combinedInjectionValues);
                    }
                    navigate(navLink || '#');
                    break;

                case 'overlay':
                    handler = async () => {
                        let content = null;
                        const ContentAdapterComponent = generateContentApapterComponent(action.overlayConfig);
                        content = <ContentAdapterComponent.Component injectionValues={combinedInjectionValues} />
                        setOverlay(content);
                        };
                    await handler();
                    break;

                case 'default':
                    if (action.onClickAction) {
                        handler = action.onClickAction;
                    }
                    else if (action.operationId) {    
                    const operationIdHandler = async () => {
                        const handleClick = getAPIActionFromOperationId(action.operationId);
                        let payload = dataModifier({action, data: combinedInjectionValues, payload: {}, props: {...props, ...outerProps}});
                        const result = await handleClick(payload);
                        action.afterClick && action.afterClick({notify, result, message, setMessage, showMessage, setShowMessage, atomState, setAtomState, props});
                    }
                    handler = operationIdHandler};
                    await handler();
                    break;
            }
            // handler()
        },
        [sendRequest, props]
    );

    return { callAction, GeneratedFormComponent, message, setMessage, setShowMessage, showMessage };
};




export const useActions = (actions: Action[]) => {
    // функция, которая генерирует действия
    if (!actions) return {};

    // генерируем список объектов действий
    const generatedActions = actions.map((el, index) => {
           return (props: ActionWrapperProps) => <ActionWrapper action={el}
                                        handleCloseContextMenu={() => {}}
                                        outerProps={props}
                                        injectionValues={props.injectionValues}
                                        key={index}
                                        parentProps={{}}>
                                            {props.children}
                          </ActionWrapper>
        });

    return generatedActions;
}
