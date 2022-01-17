import axios, {AxiosError, AxiosResponse} from 'axios';
import {ServerStatus} from '@/domain/Service/ServerStatus';
import config from '@/config';
import {GameInterface} from '@/domain/Game/GameInterface';
import {Broker} from '@/domain/Broker/Broker';
import {GameSpec} from '@/domain/Game/GameSpec';
import {BaselineSpec} from '@/domain/Baseline/BaselineSpec';
import {BaselineData} from '@/domain/Baseline/BaselineData';
import {GameData} from '@/domain/Game/GameData';

interface RestResponse {
    success: boolean;
    message: string;
    payload: any;
    games: GameInterface[];
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

    public static games(): Promise<GameData[]> {
        return new Promise<GameData[]>((resolve: (games: GameData[]) => void, reject: (error: AxiosError) => void) => {
            axios.get(config.services.orchestrator.uri + '/games/')
              .then((response: AxiosResponse<GameData[]>) => resolve(response.data))
              .catch((error: AxiosError) => reject(error));
        });
    }

    public static game(id: string): Promise<GameData> {
        return new Promise<GameData>((resolve: (games: GameData) => void, reject: (error: AxiosError) => void) => {
            axios.get(config.services.orchestrator.uri + '/games/' + id)
              .then((response: AxiosResponse<GameData>) => resolve(response.data))
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

    public static rerunGame(game: GameInterface): Promise<void> {
        return new Promise<void>((resolve: (response: void) => void, reject: (error: AxiosError) => void) => {
            axios.post(config.services.orchestrator.uri + '/games/' + game.id + '/rerun')
              .then(() => resolve())
              .catch((error: AxiosError) => reject(error));
        });
    }

    public static deleteGame(game: GameInterface): Promise<void> {
        return new Promise<void>((resolve: (response: void) => void, reject: (error: AxiosError) => void) => {
            axios.delete(config.services.orchestrator.uri + '/games/' + game.id)
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

    public static createBaseline(spec: BaselineSpec): Promise<void> {
        return new Promise<void>((resolve: (response: void) => void, reject: (error: AxiosError) => void) => {
            axios.post(config.services.orchestrator.uri + '/baselines/', spec)
              .then(() => resolve())
              .catch((error: AxiosError) => reject(error));
        });
    }

    public static baselines(): Promise<BaselineData[]> {
        return new Promise<BaselineData[]>((resolve: (response: BaselineData[]) => void, reject: (error: AxiosError) => void) => {
            axios.get(config.services.orchestrator.uri + '/baselines/')
              .then((response) => resolve(response.data))
              .catch((error: AxiosError) => reject(error));
        });
    }

}
