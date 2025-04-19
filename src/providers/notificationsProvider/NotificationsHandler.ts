import { Notification } from "./index";


export class NotificationHandler {
    private ws: WebSocket | null = null;
    private onNewNotification: (notification: Notification) => void;
    public url: string;

    constructor({
        onNewNotification,
        url
    }: {
        onNewNotification: (notification: Notification) => void;
        url: string;
    }) {
        this.onNewNotification = onNewNotification;
        this.url = url;
    }

    public connect() {
        if (this.ws) return; // Если соединение уже существует, ничего не делаем

        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
            console.log("WebSocket подключен");
        };

        this.ws.onmessage = (event: MessageEvent) => {
            try {
                const data: Notification = JSON.parse(event.data);
                this.onNewNotification(data); // Вызываем переданную функцию для добавления уведомления
            } catch (err) {
                console.error("Ошибка парсинга сообщения:", err);
            }
        };

        this.ws.onclose = (event) => {
            console.log(`WebSocket закрыт: [${event.code}] ${event.reason}`);
            this.ws = null; // Очищаем ссылку на WebSocket
        };

        this.ws.onerror = (error) => {
            console.error("WebSocket error:", error);
        };
    }

    public closeConnection() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }
}
