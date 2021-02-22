import {BrokerType} from '@/domain/types/Broker';
import {GetterTree, Module} from 'vuex';
import {RootStoreState} from '@/domain/types/RootStore';

export interface BrokerStoreModuleGetters extends GetterTree<BrokerStoreState, RootStoreState> {
    types: (state: BrokerStoreState) => BrokerType[];
    typeExists: (state: BrokerStoreState, getters: BrokerGetters) => (brokerTypeName: string) => boolean;
}

export interface BrokerStoreState {
    types: {[key: string]: BrokerType};
}

export interface BrokerStoreModule extends Module<BrokerStoreState, RootStoreState> {
    state: BrokerStoreState;
    getters: BrokerStoreModuleGetters;
}

export interface BrokerGetters {
    types: BrokerType[];
    typeExists: boolean;
}

export interface BrokerStore {
    state: BrokerStoreState;
    getters: BrokerGetters;
}
