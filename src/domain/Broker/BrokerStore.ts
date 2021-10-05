import {BrokerType} from '@/domain/types/Broker';
import {ActionContext, GetterTree} from 'vuex';
import {RootStoreState} from '@/domain/Store/RootStore';
import {Broker} from '@/domain/Broker/Broker';

export interface BrokerStoreState {
  types: { [key: string]: BrokerType };
  brokers: { [key: string]: Broker };
}

export interface BrokerStoreGetters extends GetterTree<BrokerStoreState, RootStoreState> {
  types: (state: BrokerStoreState) => BrokerType[];
  typeExists: (state: BrokerStoreState) => (brokerTypeName: string) => boolean;
  findAll: (state: BrokerStoreState) => Broker[];
}

export interface BrokerStoreMutations {
  addType: (state: BrokerStoreState, brokerType: BrokerType) => void;
  updateType: (state: BrokerStoreState, brokerType: BrokerType) => void;
  removeType: (state: BrokerStoreState, brokerType: BrokerType) => void;
  add: (state: BrokerStoreState, broker: Broker) => void;
}

export interface BrokerStoreActions {
  refresh: (context: ActionContext<BrokerStoreState, RootStoreState>) => void;
  subscribe: (context: ActionContext<BrokerStoreState, RootStoreState>) => void;
  loadAll: (context: ActionContext<BrokerStoreState, RootStoreState>) => void;
}

export interface BrokerStore {
  namespaced: boolean;
  state: BrokerStoreState;
  getters: BrokerStoreGetters;
  mutations: BrokerStoreMutations;
  actions: BrokerStoreActions;
}
