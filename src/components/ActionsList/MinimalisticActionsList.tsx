import React from "react";
import { ActionsListBlockT, ActionsListT } from "./types";
import { styled, Theme } from "@mui/material";
import { Action } from "../../contentWrappers/types";
import { AuthContext } from "../../providers/auth/AuthProvider";
import { ActionWrapper } from ".";
import { Link } from "react-router-dom";


// @ts-ignore
export const MainMenuBlock = styled("div")(({ theme }: { theme: Theme }) => ({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "50px",
}));
  
// @ts-ignore
export const SubBlock = styled("div")(({ theme }: { theme: Theme }) => ({
    display: "flex",
    gap: "15px",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(70, 72, 74, 0.22)",
    backdropFilter: "blur(10px)",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
    width: "100%",
    marginTop: "7px",
    marginBottom: "7px",
    padding: "5px",
    borderRadius: "10px",
}));

export const SubBlockItem = styled("div", {
    shouldForwardProp: (prop) => prop !== "isActive",
    })<{ isActive?: boolean }>(({ theme, isActive }) => ({
    // Делаем родителя позиционируемым
    position: "relative",
    height: "30px",
    width: "30px",
    display: "grid",
    placeItems: "center",
    color: "white",
    borderRadius: "10px",
    backgroundColor: isActive ? theme.palette.grey[800] : "transparent",
    "&:hover": {
        backgroundColor: "rgba(24, 26, 27, 0.2)",
    },
}));

// @ts-ignore
export const SubBlockItemText = styled("div")(({ theme }: { theme: Theme }) => ({
// Скрываем по умолчанию
    display: "none",
    position: "absolute",
    top: "0px",
    left: "50px",
    padding: "7px",
    borderRadius: "10px",
    backgroundColor: theme.palette.grey[800],
    width: "300%"
}));


const Item: React.FC<Action> = (props) => {
    const [isActive, setActive] = React.useState(false);
    const {exit} = React.useContext(AuthContext);

    const ItemContent = React.useMemo(() => {
        return (
            <SubBlockItem
                // @ts-ignore
                onClick={()=>exit?props.onClickAction(exit):props.onClickAction()}
                onMouseEnter={()=>setActive(true)}
                onMouseLeave={()=>setActive(false)}>
                {props.icon}
                <SubBlockItemText 
                    style={{
                        display: isActive ? "block" : "none", 
                        fontSize: 13,
                        // @ts-ignore
                        ...(props.isVertical ===false ? { bottom: 50, left: 0, top: "unset" } : {left: "50px", top: 0})
                    }}
                    >
                    {props.label}
                </SubBlockItemText>
            </SubBlockItem>
        );
    },[isActive])

    return (
          // @ts-ignore
        <ActionWrapper injectionValues={props.injectionValues} key={props.label} action={props} outerProps={{}} parentProps={{}}>
            {props.actionType === "link" ? 
                // @ts-ignore
                <Link to={props.link}>{ItemContent}</Link>
                : ItemContent
        }
      </ActionWrapper>
    );
}


const ItemsBlock: React.FC<ActionsListBlockT> = (props) => {
    return props.unpack ? (
        // @ts-ignore
        <SubBlock style={{display: "flex", flexDirection: props.isVertical ? "column" : "row"}}>
            {/* @ts-ignore */}
            {props.actions.map((action) => <Item injectionValues={props.injectionValues} isVertical={props.isVertical} key={action.label} {...action} />)}
        </SubBlock>
    ):<div>unpack: false пока не реализован</div>
}


export type ActionsListProps = {
    isVertical: boolean;
    injectionValues?: any;
} & ActionsListT;


export const MinimalisticActionsList: React.FC<ActionsListProps> = (props) => {
    const isVertical = props.isVertical;
    const [width, setWidth] = React.useState("fit-content");
    const [height, setHeight] = React.useState("fit-content");

    return (
        <div 
            style={{height: height, width: width}}>
            <MainMenuBlock
                style={isVertical === false?{flexDirection: "row", width: "100%", height: "fit-content"}:{}}>
                {/* @ts-ignore */}
                {props.blocks.map((block) => <ItemsBlock injectionValues={props.injectionValues} isVertical={isVertical} key={block.title} {...block} />)}
            </MainMenuBlock>
        </div>
    );
};