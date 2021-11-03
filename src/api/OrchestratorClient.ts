import axios, {AxiosError, AxiosResponse} from 'axios';
import {ServerStatus} from '@/domain/Service/ServerStatus';
import config from '@/config';
import {Game} from '@/domain/Game/Game';
import {Broker} from '@/domain/Broker/Broker';
import {GameSpec} from '@/domain/Game/GameSpec';

interface RestResponse {
    success: boolean;
    message: string;
    payload: any;
    games: Game[];
}

export class OrchestratorClient {

    public static supportedParams(): Promise<string[]> {
        return new Promise<string[]>((resolve: (params: string[]) => void,
                                      reject: (error: AxiosError) => void) => {
            axios.get(config.services.orchestrator.uri + '/game-parameters/')
                .then((response: AxiosResponse<string[]>) => resolve(response.data))
                .catch((response: AxiosError) => reject(response));
        });
    }

    public static serverStatus(): Promise<ServerStatus> {
        return new Promise<ServerStatus>((resolve: (params: ServerStatus) => void,
                                          reject: (error: AxiosError) => void) => {
            axios.get(config.services.orchestrator.uri + '/status', {timeout: 2500})
                .then((response: AxiosResponse<RestResponse>) => resolve(response.data.payload))
                .catch((response: AxiosError) => reject(response));
        });
    }

    public static games(): Promise<Game[]> {
        return new Promise<Game[]>((resolve: (games: Game[]) => void, reject: (error: AxiosError) => void) => {
            axios.get(config.services.orchestrator.uri + '/games/')
              .then((response: AxiosResponse<Game[]>) => resolve(response.data))
              .catch((error: AxiosError) => reject(error));
        });
    }

    public static game(id: string): Promise<Game> {
        return new Promise<Game>((resolve: (games: Game) => void, reject: (error: AxiosError) => void) => {
            axios.get(config.services.orchestrator.uri + '/games/' + id)
              .then((response: AxiosResponse<Game>) => resolve(response.data))
              .catch((error: AxiosError) => reject(error));
        });
    }

    public static createGame(spec: GameSpec): Promise<void> {
        return new Promise<void>((resolve: (response: void) => void, reject: (error: AxiosError) => void) => {
            axios.post(config.services.orchestrator.uri + '/games/', spec)
              .then(() => resolve())
              .catch((error: AxiosError) => reject(error));
        });
    }

    public static brokers(): Promise<Broker[]> {
        return new Promise<Broker[]>((resolve: (response: Broker[]) => void, reject: (error: AxiosError) => void) => {
            axios.get(config.services.orchestrator.uri + '/brokers/')
              .then((response: AxiosResponse<Broker[]>) => resolve(response.data))
              .catch((error: AxiosError) => reject(error));
        });
    }

    public static createBroker(broker: Broker): Promise<void> {
        return new Promise<void>((resolve: (response: void) => void, reject: (error: AxiosError) => void) => {
            axios.post(config.services.orchestrator.uri + '/brokers/', broker)
              .then(() => resolve())
              .catch((error: AxiosError) => reject(error));
        });
    }

    public static images(): Promise<Image[]> {
        return new Promise<Image[]>((resolve: (response: Image[]) => void, reject: (error: AxiosError) => void) => {
            axios.get(config.services.orchestrator.uri + '/docker/images/')
              .then((response: AxiosResponse<Image[]>) => resolve(response.data))
              .catch((error: AxiosError) => reject(error));
        });
    }

}
