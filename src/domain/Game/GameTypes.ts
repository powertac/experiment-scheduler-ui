import {BrokerSpec} from '@/domain/Broker/BrokerSpec';
import {ActionContext, GetterTree} from 'vuex';
import {RootStoreState} from '@/domain/types/RootStore';
import {Parameter} from '@/domain/types/Parameter';

// TODO : rename to GameSpec after removing old one
export interface NewGameSpec {
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

export interface GameStoreState {
    games: {[key: string]: Game};
}

export interface GameStoreGetters extends GetterTree<GameStoreState, RootStoreState> {
    find: (state: GameStoreState, getters: GameStoreGetters) => (id: string) => Game|null;
    findAll: (state: GameStoreState, getters: GameStoreGetters) => Game[];
}

export interface GameStoreActions {
    load: (context: ActionContext<GameStoreState, RootStoreState>, id: string) => void;
    loadAll: (context: ActionContext<GameStoreState, RootStoreState>) => void;
    subscribe: (context: ActionContext<GameStoreState, RootStoreState>) => void;
}

export interface GameStoreMutations {
    add: (state: GameStoreState, game: Game) => void;
}

export interface GameStore {
    namespaced: boolean;
    state: GameStoreState;
    getters: GameStoreGetters;
    mutations: GameStoreMutations;
    actions: GameStoreActions;
}
