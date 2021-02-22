import axios, {AxiosError, AxiosResponse} from 'axios';
import {Job} from '@/domain/types/Job';
import {BrokerType} from '@/domain/types/Broker';
import {ServerStatus} from '@/domain/types/Server';
import config from '@/config';
import {ExperimentSpec} from '@/domain/Experiment/ExperimentSpec';
import {Experiment} from '@/domain/Experiment/Experiment';
import {GameSpec} from "@/domain/Game/GameSpec";

interface RestResponse {
    success: boolean;
    message: string;
    payload: any;
    experiments: Experiment[];
}

interface JobResponse {
    success: boolean;
    job: Job;
}

export class RestClient {

    public static createGameInstance(game: GameSpec): Promise<void> {
        return new Promise<void>((resolve: (response: void) => void, reject: (error: AxiosError) => void) => {
            axios.post(config.services.orchestrator.uri + '/games/', game)
                .then((response: AxiosResponse<void>) => resolve())
                .catch((error: AxiosError) => reject(error))
        });
    }

    public static job(id: string): Promise<Job> {
        return new Promise<Job>((resolve: (job: Job) => void, reject: (error: AxiosError) => void) => {
            axios.get(config.services.orchestrator.uri + '/jobs/' + id)
                .then((response: AxiosResponse<JobResponse>) => resolve(response.data.job))
                .catch((response: AxiosError) => reject(response));
        });
    }

    public static jobs(): Promise<Job[]> {
        return new Promise<Job[]>((resolve: (jobs: Job[]) => void, reject: (error: AxiosError) => void) => {
            axios.get(config.services.orchestrator.uri + '/jobs/')
                .then((response: AxiosResponse<RestResponse>) => resolve(response.data.payload))
                .catch((response: AxiosError) => reject(response));
        });
    }

    public static brokerTypes(): Promise<BrokerType[]> {
        return new Promise<BrokerType[]>((resolve: (brokerTypes: BrokerType[]) => void,
                                          reject: (error: AxiosError) => void) => {
            axios.get(config.services.orchestrator.uri + '/brokers/types/')
                .then((response: AxiosResponse<RestResponse>) => resolve(response.data.payload))
                .catch((response: AxiosError) => reject(response));
        });
    }

    public static supportedParams(): Promise<string[]> {
        return new Promise<string[]>((resolve: (params: string[]) => void,
                                      reject: (error: AxiosError) => void) => {
            axios.get(config.services.orchestrator.uri + '/jobs/supported-params/')
                .then((response: AxiosResponse<RestResponse>) => resolve(response.data.payload))
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

    public static createExperiment(experiment: ExperimentSpec): Promise<string> {
        return new Promise<string>((resolve: (success: string) => void,
                                     reject: (error: AxiosError) => void) => {
            axios.post(config.services.orchestrator.uri + '/experiments/', experiment)
                .then((response: AxiosResponse<RestResponse>) => resolve(response.data.experiments))
                .catch((response: AxiosError) => reject(response));
        });
    }

    public static experiments(): Promise<Experiment[]> {
        return new Promise<Experiment[]>((resolve: (experiments: Experiment[]) => void,
                                          reject: (error: AxiosError) => void) => {
            axios.get(config.services.orchestrator.uri + '/experiments/')
                .then((response: AxiosResponse<RestResponse>) => resolve(response.data.experiments))
                .catch((response: AxiosError) => reject(response));
        });
    }

}
