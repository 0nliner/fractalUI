import React from "react"

import {Dialog} from "@mui/material"


// TODO: код из старого проекта, отредачить

export interface ModalFormProps {
    formOpened: boolean;
    setFormOpened: React.Dispatch<React.SetStateAction<boolean>>;
    // onClose: (value: boolean) => void;
    children?: React.ReactNode
}


export const ModalForm = (props: ModalFormProps) => {
    // const [opened, setFormOpened] = React.useState<boolean>(false);

    return (
      <Dialog onClose={()=>props.setFormOpened(!props.formOpened)} open={props.formOpened}>
        <div style={{padding: "50px"}}>
            {props.children??null}    
        </div>
      </Dialog>
    );
}

