import React from "react";
import { NavigationProps } from "../../components/navigations/types";
import Lavalamp, { LavaLampBubblesProps } from "./Lavalamp";


// TODO
export type LavaLampWrapperProps = {
    children: React.ReactNode
}
 & LavaLampBubblesProps;

 
const LavaLampWrapper: React.FC<LavaLampWrapperProps> = (props) => {
    return (
        <div style={{ position: "relative", height: "100%", width: "100%" }}>
            <div style={{ zIndex: 100, position: "relative", height: "100%", width: "100%" }}>{props.children}</div>
            <div style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }}>
                <Lavalamp {...props}/>
            </div>
        </div>
    );
};

export { LavaLampWrapper };
