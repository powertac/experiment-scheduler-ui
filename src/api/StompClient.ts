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
const subscriptions: Map<string, Subscriber<any>> = new Map<string, Subscriber<any>>();

export interface Subscriber<T> {
    channel: string;
    callback: (entity: T) => void;
}

export class StompClient {

    public static initialize(): void {
        this.connect()
          .then(() => {
              for (const subscription of subscriptions.values()) {
                client.subscribe(
                  subscription.channel,
                  (message) => subscription.callback((JSON.parse(message.body))));
              }
          })
          .catch(() => console.error('unable to establish websocket connection'))
        ;
    }

    public static connect(): Promise<void> {
        return new Promise((resolve: () => void, reject: (error: AxiosError) => void) => {
            try {
                if (!isConnected) {
                    client.connect({}, () => {
                        resolve();
                        isConnected = true;
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
        subscriptions.set(destination, {channel: destination, callback});
        if (isConnected) {
            client.subscribe(destination, (message: IMessage) => callback(JSON.parse(message.body)));
        }
    }

}
