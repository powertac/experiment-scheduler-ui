import SockJS from 'sockjs-client';
import {CompatClient, IMessage, Stomp} from '@stomp/stompjs';
import {AxiosError} from 'axios';
import config from '@/config';

const socketFactory: () => WebSocket = () => new SockJS(config.services.orchestrator.uri + '/ws');
const client: CompatClient = Stomp.over(socketFactory);

client.heartbeatOutgoing = 10000;
// setting client.debug to "empty" function disables logging
client.debug = () => { return; };

let isConnected: boolean = false;

export enum RequestAction {
    create = 'CREATE',
    update = 'UPDATE',
    remove = 'REMOVE',
}

export interface RequestMessage {
    action: RequestAction;
    payload: any;
}

export class StompClient {

    public static get isConnected(): boolean {
        return isConnected;
    }

    public static connect(): Promise<void> {
        return new Promise((resolve: () => void, reject: (error: AxiosError) => void) => {
            try {
                if (!isConnected) {
                    client.connect({}, () => {
                        isConnected = true;
                        resolve();
                    });
                    return;
                }
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

    public static subscribe<T>(destination: string, callback: (payload: T) => void): void {
        this.connect().then(() =>
            client.subscribe(destination, (message: IMessage) => {
                callback(JSON.parse(message.body));
            }));
    }

    public static send<T>(destination: string, payload: T, headers: {[key: string]: any} = {}): void {
        this.connect().then(() => {
            client.send(
                destination,
                headers,
                JSON.stringify(payload));
            })
            .catch((error) => console.log(error));
    }

}
