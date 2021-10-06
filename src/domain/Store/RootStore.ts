import {ModuleTree, Store} from 'vuex';
import {Notification} from '@/domain/types/Notification';
import {BrokerStore} from '@/domain/Broker/BrokerStore';
import {ServerStatus} from '@/domain/Service/ServerStatus';
import {GameStore} from '@/domain/Game/GameStore';

export interface RootStoreState {
    notifications: Notification[];
    orchestratorStatus: ServerStatus;
    time: number;
}

export interface RootStore extends Store<RootStoreState> {
    modules: RootStoreModules;
}

export interface RootStoreModules extends ModuleTree<RootStoreState> {
    brokers: BrokerStore;
    games: GameStore;
}
