import {Broker} from '@/domain/types/Broker';
import {Experiment} from "@/domain/Experiment/Experiment";

export enum JobState {
    pending = 'PENDING',
    queued = 'QUEUED',
    running = 'RUNNING',
    failed = 'FAILED',
    completed = 'COMPLETED',
}

export interface JobStatus {
    start: number;
    end: number;
    duration: number;
    removed: boolean;
    state: JobState;
}

export interface Parameter {
    parameter: string;
    value: string;
}

export interface JobConfig {
    'simulation-parameters': Parameter[];
}

export interface Job {
    id: string;
    name: string;
    type: string;
    brokers: Broker[];
    config: JobConfig;
    status: JobStatus;
    files: {[key: string]: string};
    experiment: Experiment;
    log?: string;
}

export interface JobRequest {
    name: string;
    brokers: string[];
    params?: Parameter[];
}
