import { Link } from "react-router-dom";
import { LavaLampWrapper } from "../../ui/lavaLamp/LavaLampWrapper";
import { NavigationProps } from "./types";
import React from "react";
import { styled, Theme } from "@mui/material";
import { authContext } from "../../context";
import { AuthContext } from "../../providers/auth/AuthProvider";


type DefaultNavigationProps = {
    enableLavaLamp: boolean;
};

export type defaultNavigationProps = NavigationProps & DefaultNavigationProps;

const DefaultNavigationBlock = styled("nav")(({ theme }: { theme: Theme }) => ({
    width: "100%",
    maxWidth: 360,
    minWidth: 240,
    height: "100vh",
    // display: "flex",
    // flexDirection: "column",
    position: "sticky",
    top: 0,
    left: 20,
    borderRadius: "10px",
    overflow: "hidden",
}));

const ContentAlignWrapper = styled("div")(({ theme }: { theme: Theme }) => ({
    display: "flex",
    flexDirection: "column",
    gap: 10,
    padding: "20px 10px",
    justifyContent: "start",
    height: "100%",
}));

const DefaultNavigation: React.FC<defaultNavigationProps> = ({ navigationItems, enableLavaLamp }) => {
    // console.log("navigationItems", navigationItems);
    const {exit} = React.useContext(AuthContext)

    const NavContent: React.FC = () => {
        return (
            <ContentAlignWrapper>
                {navigationItems?.map((el, index) => {
                    // console.log("link", el);
                    if (el.link) {
                        return (
                            <Link to={el.link} key={index} style={{ marginRight: 10 }}>
                                {el.title}
                            </Link>
                        );
                    }
                    else {
                        return <div onClick={()=>el.onClick(exit)} key={index}>{el.title}</div>;
                    }
                })}
            </ContentAlignWrapper>
        );
    };

    return (
        <DefaultNavigationBlock>
            {enableLavaLamp ? (
                // @ts-ignore
                <LavaLampWrapper>
                    <NavContent />
                </LavaLampWrapper>
            ) : (
                <NavContent />
            )}
        </DefaultNavigationBlock>
    );
};

export default DefaultNavigation;
