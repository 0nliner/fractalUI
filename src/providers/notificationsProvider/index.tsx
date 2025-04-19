// @ts-nocheck 
import React, { useCallback, useContext } from "react";
import {VITE_BACKEND_IP, VITE_BACKEND_PORT} from "../../../config";
import { Notifications } from "@mui/icons-material";
import { createPortal } from "react-dom";
import { NotificationHandler } from "./NotificationsHandler";
import { Card, IconButton, Paper } from "@mui/material";
import { NotificationComponent } from "./Notification";


interface NotificatorParams {
    notifications?: Array<any>,
    children?: React.ReactNode
    // item: React.FC<any>
}

type NotificationContent = {
  text: string
};

export type Notification = {
    id?: string
    content: NotificationContent,
    status?: string,
    delete_after?: number
};

export const NotificationsNavButton: React.FC = () => {
    const [showDetailed, setShow] = React.useState(false);
    const {notifications, closeNotification} = useContext(NotificationContext);
    return (
        <div style={{position: "relative"}}>
            <IconButton onClick={() => setShow(!showDetailed)} sx={{ ml: 1 }} color="inherit" aria-label="visualize notifications">
                <Notifications/>
            </IconButton>
            {
                showDetailed &&
            <Paper style={{
                    minHeight: "100px",
                    maxHeight: "100vh",
                    width: "200px",
                    position: 'fixed',
                    overflowY: "scroll",
                    overflowX: 'hidden',
                    scrollbarWidth: "none",
                    flexDirection: "column",
                    zIndex: 10000,
                    right: 50,
                    top: 60,
                    background: "rgb(62, 99, 90, 0.15)",
                    backdropFilter: "blur(10px)",
                    }}>
                    <div style={{
                        height: "100%",
                        width: "100%",
                        gap: "10px", 
                        padding: "10px",
                        display: notifications.length > 0 ? "flex": "none",
                        flexDirection: "column",
                        justifyContent: "start"}}>
                        {notifications.map(notification => <NotificationComponent {...notification} onClose={closeNotification}/>)}
                    </div>
            </Paper>
            }
        </div>
    );
}

export type NotificationContextT = {
    notify: (notification: Notification) => void;
    notifications: Notification[];
    closeNotification: (id: string) => VoidFunction;
};

export const NotificationContext = React.createContext<NotificationContextT>(
    {
        notify: () => {},
        notifications: [],
        closeNotification: (id: string) => {}
    });


// TODO: добавить возможность открыть историю уведомлений
// TODO: добавить конфиг на генерацию уведомлений
const NotificationsProvider = React.forwardRef((props: NotificatorParams, ref) => {
    const [notifications, setNotifications] = React.useState<Notification[]>([]);
    
    React.useEffect(() => {
        const messagesHandler = new NotificationHandler({
            onNewNotification: (notification) => {
                setNotifications([...notifications, notification]);
            },
            // TODO: подстановка кредов
            url: `ws://${VITE_BACKEND_IP}:${VITE_BACKEND_PORT}/notifications`
        });

        return () => {
            messagesHandler.closeConnection();
        };
      }, []);

    const checkIfHeaderLoaded = React.useCallback(() => {
        const el = document.getElementById("headerNavPortalRoot");
        if (el) {
            setIsHeaderLoading(false);
        }
    }, [])

    React.useEffect(() => {
        const timeout = setTimeout(() => checkIfHeaderLoaded(), 500)
        return () => clearTimeout(timeout);
    }, []);

    const [isHeaderLoading, setIsHeaderLoading] = React.useState(true);
    const closeNotification = (id: string) => setNotifications(notifications.filter(notification => notification.id !== id))

    const addNotification = (notification: Notification) => {
        setNotifications([...notifications, notification])
    }


    React.useImperativeHandle(ref, () => ({
        addNotification: (newOne: Notification) => addNotification,
        addNotifications: (newOne: Array<Notification>) => setNotifications([...notifications, ...newOne]),
        closeAll: () => setNotifications([]),
        closeNotification: closeNotification,
        notifications: notifications
    }));

    return (
        <>
            <NotificationContext.Provider value={{
                notify: addNotification,
                notifications,
                closeNotification: closeNotification}}>

                {isHeaderLoading === false && 
                createPortal(
                    <NotificationsNavButton/>,
                    document.getElementById("headerNotificationPortalRoot")!
                )
                }
                {props.children}
            </NotificationContext.Provider>
        </>
    )
});

export {NotificationsProvider};
