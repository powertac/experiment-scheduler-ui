import {BrokerSpec} from '@/domain/Broker/BrokerSpec';

export interface GameSpec {
    name: string;
    baseGameId?: string;
    serverParameters: {[key: string]: string};
    brokers: BrokerSpec[];
}

export interface Game {
    id: string;
    name: string;
    brokers: BrokerSpec[];
    serverParameters: {[key: string]: string};
    bootstrap: File;
    seed: File;
    runs: GameRun[];
    files: {[key: string]: string};
    cancelled: boolean;
    createdAt: number;
    status: string;
    statusIndex: number;
    start: number;
    end: number;
    isValidTemplate: boolean;
}

export interface GameRun {
    id: string;
    game: string;
    start: number;
    end: number;
    phase: string;
    failed: boolean;
}
