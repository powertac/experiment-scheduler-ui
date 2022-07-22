import axios, {AxiosError, AxiosResponse} from 'axios';
import {ServerStatus} from '@/domain/Service/ServerStatus';
import config from '@/config';
import {Broker} from '@/domain/Broker/Broker';
import {GameSpec} from '@/domain/Game/GameSpec';
import {BaselineSpec} from '@/domain/Baseline/BaselineSpec';
import {BaselineData} from '@/domain/Baseline/BaselineData';
import {GameData} from '@/domain/Game/GameData';
import {TreatmentData, TreatmentSpec} from '@/domain/Treatment/Treatment';
import FileNode from '@/domain/File/FileNode';
import Game from '@/domain/Game/Game';
import {BaselineConfig} from '@/domain/Baseline/BaselineConfig';

interface RestResponse {
    success: boolean;
    message: string;
    payload: any;
    games: GameData[];
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
        console.log(id)
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

    public static rerunGame(game: Game): Promise<void> {
        return new Promise<void>((resolve: (response: void) => void, reject: (error: AxiosError) => void) => {
            axios.post(config.services.orchestrator.uri + '/games/' + game.id + '/rerun')
              .then(() => resolve())
              .catch((error: AxiosError) => reject(error));
        });
    }

    public static deleteGame(game: Game): Promise<void> {
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

    public static createTreatment(spec: TreatmentSpec<any>): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            axios.post(config.services.orchestrator.uri + '/treatments/', spec)
              .then((response) => resolve(response.data))
              .catch((error) => reject(error));
        });
    }

    public static treatments(): Promise<TreatmentData[]> {
        return new Promise<TreatmentData[]>((resolve, reject) => {
            axios.get(config.services.orchestrator.uri + '/treatments/')
              .then((response) => resolve(response.data))
              .catch((error) => reject(error));
        });
    }

    public static runFiles(runId: string): Promise<FileNode> {
        return new Promise<FileNode>((resolve, reject) => {
            axios.get(config.services.orchestrator.uri + '/files/run/' + runId)
              .then((response) => resolve(response.data))
              .catch((error) => reject(error));
        });
    }

    public static fileContent(file: FileNode): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            axios.get(config.services.orchestrator.uri + '/files', {params: {path: file.path, offset: 0, length: 5000}})
              .then((response) => resolve(response.data))
              .catch((error) => reject(error));
        });
    }

    public static generateBaseline(baselineConfig: BaselineConfig): Promise<void> {
        return new Promise<void>((resolve, reject) => {
           axios.post(config.services.orchestrator.uri + '/baselines/generate', baselineConfig)
             .then(() => resolve())
             .catch((e) => reject(e));
        });
    }

}
