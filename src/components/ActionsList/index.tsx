import React from "react";
import { Action } from "../../contentWrappers/types";
import { MinimalisticActionsList } from "./MinimalisticActionsList";
import { useCallAction } from "./utils";
import { ModalForm } from "../../autoforms/ModalForm";
import { Alert, Snackbar } from "@mui/material";
import ReactDOM from "react-dom";

// TODO: варианты списков, все они генерятся из блоков с action'ами, 
// внутри каждого создаётся портал для рендера внутри контекстных действий

// кнопка с выпадающим списком используется (Menu и MenuItem)
// shapr like список

export {MinimalisticActionsList};


export type ActionWrapperProps = {
    action: Action,
    handleCloseContextMenu: () => void,
    outerProps: any,
    parentProps: object,
    injectionValues?: object,
    children: React.ReactNode}
  

export const ActionWrapper: React.FC<ActionWrapperProps> = (props) => {
    const {callAction, GeneratedFormComponent, message, setMessage, showMessage, setShowMessage} = useCallAction(props.action, props.outerProps, props.parentProps);
    // const isOpened = props.action.asModal? true : false
    const [formOpened, setFormOpened] = React.useState<boolean>(false);
    // const [showNotification, setShowNotification] = React.useState<boolean>(false);
    // const [notification, setNotification] = React.useState<string>("test");

    return (
      <>
        {props.action.actionType === "form"&&Boolean(GeneratedFormComponent)&&<ModalForm formOpened={formOpened} setFormOpened={setFormOpened}>{GeneratedFormComponent}</ModalForm>}
        <div onClick={async (e)=>{
                    await callAction(props.injectionValues, {})
                    setFormOpened(!formOpened)
                    if (message) {
                      setShowMessage(true);
                      setMessage(message);
                    }
                    }}>
          {props.children}
        </div>
        { document.getElementById("snackbarLayout") &&
          ReactDOM.createPortal(
            <Snackbar
            open={showMessage}
            autoHideDuration={6000}
            onClose={() => setShowMessage(false)}
            message={message}>
              <Alert severity="success" onClose={() => setShowMessage(false)}>
                {message}
              </Alert>
            </Snackbar>, document.getElementById("snackbarLayout")
          )
        }
      </>
    )
  } 