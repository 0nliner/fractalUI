import React from "react";
import { Action } from "../../contentWrappers/types";
import { ActionsListProps } from "./MinimalisticActionsList";

export type ActionsListT = {
    position: "left" | "right" | "top" | "bottom";
    blocks: ActionsListBlockT[];
    Component: React.FC<ActionsListProps>;
};

export type ActionsListBlockT = {
    // "вывернуть" ли все элементы блока, или оставить 
    // их сокрытыми под единой иконкой блока
    title?: string;
    unpack?: boolean;
    actions: Action[];
    icon?: React.ReactNode;
}
