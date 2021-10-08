import {Broker} from '@/domain/Broker/Broker';
import {GameRun} from '@/domain/Game/GameRun';

export interface Game {
    id: string;
    name: string;
    brokers: Broker[];
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
