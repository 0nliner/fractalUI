import React, { memo, useContext, useMemo } from "react";
import { ColorModeProvider } from "./themeSwitcher";
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from 'recoil';

import PageSwitcher from "./autoRouter";
import { AppConfig } from "../contentWrappers/types";
import { authContext, AuthProvider } from "./auth";
import { convertOpenApiToJsonSchema, fetchOpenApiSpec } from "../autoforms/utils";

import { OverlayProvider } from "./overlayProvider";
import { MinimalisticActionsList } from "../components/ActionsList";

import { LavaLampWrapper } from "../ui/lavaLamp/LavaLampWrapper";
import { NotificationsProvider } from "./notificationsProvider";
import GradientComponent from "../components/uuidAvatar";
import { Client } from "@hey-api/client-axios";


export type AppProviderProps = {
    children?: React.ReactNode;
    openapiSpec?: object;
    renderForm: (component: React.ReactNode) => void,
    openapiSpecUrl: string,
    client?: any,
    api_sdk_module?: any 
    VITE_BACKEND_IP?: string,
    VITE_BACKEND_PORT?: string | number
}

export type FullAppProviderProps = AppProviderProps & AppConfig 

export type AppProviderContextType = FullAppProviderProps & {
    openapiSpec?: object;
};


export const AppProviderContext = React.createContext<AppProviderProps|FullAppProviderProps>({
    openapiSpecUrl: "",
    openapiSpec: {},
    renderForm: (component: React.ReactNode) => {},
    client: null,
    api_sdk_module: null,
});


const Avatar = memo(() => {
    const {profileAvatar} = useContext(authContext);
    return (
        profileAvatar ? <img src={profileAvatar} style={{borderRadius: "100px", width: "32px", height: "32px"}}/> :
        <GradientComponent />
    )
})


const AppProvider: React.FC<FullAppProviderProps> = (props) => {
    const [openApiSpec, setOpenApiSpec] = React.useState<object>({});
    console.log("openApiSpec", openApiSpec);

    // @ts-ignore
    const notificationProviderRef = React.useRef<NotificatorParams>({});
    React.useEffect(() => {
        const fetchSpec = async () => {
            console.log("trying to fetch docs");
            let data = await fetchOpenApiSpec(props.openapiSpecUrl);
            data = convertOpenApiToJsonSchema(data);
            console.log("fetch spec appProvider", data);
            setOpenApiSpec(data);
        }
        fetchSpec();
    }, [])

    const UserAvatar = useMemo(() => {
        return <Avatar/>;
    }, [])

    React.useEffect(() => {}, [openApiSpec])
    if (Object.keys(openApiSpec).length === 0) {
        return <div>Загрузка</div>
    }

    // TODO: useModuleClient
    let client: Client 
    if (!props.client) {
        client = props.api_sdk_module.client;
    }
    else {
        client = props.client;
    }

    client.setConfig({
        baseURL: `http://${props.VITE_BACKEND_IP}:${props.VITE_BACKEND_PORT}`,
      });

    if (localStorage.getItem("accessToken")) {          
        client.instance.interceptors.request.use((config) => {
            config.headers.set('Authorization', `Bearer ${localStorage.getItem("accessToken")}`); 
            return config;
        });
    }

    return (
        <RecoilRoot>
            <div id="snackbarLayout" style={{zIndex: 1600}}></div>
            <AppProviderContext.Provider value={{...props, openapiSpec: openApiSpec}}>
                <ColorModeProvider>
                    <LavaLampWrapper count={15} colorStart="#FF5733" colorEnd="#33FF57">

                    <AuthProvider>
                            <BrowserRouter>
                                <div id="formLayout"></div>
                                <OverlayProvider>
                                    <NotificationsProvider ref={notificationProviderRef}>

                                        {/* <AnimatedBackground gradientCount={5} colorRange={["#FF5733", "#33FF57"]} /> */}
                                        <header style={{ display: "flex", alignItems: "center", padding: "10px 20px", justifyContent: "space-between"}}>
                                            {props.brandingConfig && (
                                                <div style={{ display: "flex", alignItems: "center" }}>
                                                    {props.brandingConfig?.logoIcon && <div style={{ marginRight: "10px" }}>{props.brandingConfig.logoIcon}</div>}
                                                    <h2>{props.brandingConfig.logoText}</h2>
                                                </div>
                                            )}
                                            <div id="headerSearchPortalRoot"></div>
                                            <div style={{ display: "flex", alignItems: "center" }}>
                                                <div id="headerNavPortalRoot"></div>
                                                <div id="headerNotificationPortalRoot"></div>
                                                {/* <div id="headerAvatarPortalRoot"></div> */}
                                                <div style={{paddingLeft: "10px"}}>
                                                    {UserAvatar}
                                                </div>
                                            </div>
                                        </header>

                                        <div
                                            className="main-wrp"
                                            style={{ display: "flex", justifyContent: "space-between", width: "98vw", gap: "20px"}}
                                        >
                                            {/* <aside style={{ overflowY: "scroll", overflowX: "visible", scrollbarWidth: "none", height: window.innerHeight - 110, paddingRight: "20px"}}> */}
                                            <aside style={{zIndex: 10, height: window.innerHeight - 70, placeContent: "center", position: "relative", left: "20px"}}>
                                                {/* TODO: nav extra actions */}
                                                {props.navigation.Component ? (
                                                    <props.navigation.Component {...props.navigation}/>
                                                ) : (
                                                    <MinimalisticActionsList {...props.navigation}/>
                                                )}
                                            </aside>
                                            <main style={{overflow: "scroll", position: "absolute", scrollbarWidth: "none", width: "100%", height: window.innerHeight - 70}}>
                                                <PageSwitcher pagesConfigs={props.pagesConfig} />
                                            </main>
                                            <aside></aside>
                                        </div>

                                        {props.children}
                                        </NotificationsProvider>
                                </OverlayProvider>
                            </BrowserRouter>
                    </AuthProvider>
                    </LavaLampWrapper>
                </ColorModeProvider>
            </AppProviderContext.Provider>
        </RecoilRoot>
    );
};

export { AppProvider };
