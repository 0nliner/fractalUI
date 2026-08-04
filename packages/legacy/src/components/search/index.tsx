import { Divider, IconButton, InputBase, Paper } from "@mui/material";
import React from "react";
import SearchIcon from '@mui/icons-material/Search';
import { FilterAction } from "../../contentWrappers/types";
import { FilterAlt } from "@mui/icons-material";
import { ModalForm } from "../../autoforms/ModalForm";
import { ActionWrapper } from "../ActionsList";
import { RecoilState } from "recoil";


export type SearhProps = {
    onSubmit: (value: string) => void;
    portDataAtom?: RecoilState<any>;
    filterAction?: FilterAction;
    filterPayload?: object;
    setFilterPayload?: React.Dispatch<React.SetStateAction<object>>;
};


export const Search = (props: SearhProps) => {
    const [filterFormOpened, setFilterFormOpened] = React.useState(false);
    return (
        <Paper sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}>
            {
                filterFormOpened && 
                // @ts-ignore
                <ActionWrapper action={props.filterAction} injectionValues={{}} outerProps={{}} parentProps={{}}/>
            }
            {/* <ModalForm formOpened={filterFormOpened} setFormOpened={setFilterFormOpened}>
                {formComponent}
            </ModalForm> */}
            <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Поиск"
                inputProps={{ 'aria-label': 'Поиск...' }}
            />
            {
                props.filterAction&&
                <IconButton type="button"
                            sx={{ p: '10px' }}
                            aria-label="filter-search"
                            onClick={(e)=>setFilterFormOpened(true)}>
                    <FilterAlt />
                </IconButton>
            }

            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
             {/* @ts-ignore */}
            <IconButton type="button" sx={{ p: '10px' }} onClick={(e)=>props.onSubmit(e.target.value)} aria-label="search">
                <SearchIcon />
            </IconButton>
        </Paper>
    );
}