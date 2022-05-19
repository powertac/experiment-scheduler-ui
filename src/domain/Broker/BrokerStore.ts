import {ActionContext, ActionTree, GetterTree, Module, MutationTree} from 'vuex';
import {RootStoreState} from '@/domain/Store/RootStore';
import {Broker} from '@/domain/Broker/Broker';

export interface BrokerStoreState {
  brokers: { [key: string]: Broker };
}

export interface BrokerStoreGetters extends GetterTree<BrokerStoreState, RootStoreState> {
  find: (state: BrokerStoreState) => (id: string) => Broker|null;
  findAll: (state: BrokerStoreState) => Broker[];
}

export interface BrokerStoreMutations extends MutationTree<BrokerStoreState> {
  add: (state: BrokerStoreState, broker: Broker) => void;
}

export interface BrokerStoreActions extends ActionTree<BrokerStoreState, RootStoreState> {
  subscribe: (context: ActionContext<BrokerStoreState, RootStoreState>) => void;
  loadAll: (context: ActionContext<BrokerStoreState, RootStoreState>) => void;
}

export interface BrokerStore extends Module<BrokerStoreState, RootStoreState> {
  namespaced: boolean;
  state: BrokerStoreState;
  getters: BrokerStoreGetters;
  mutations: BrokerStoreMutations;
  actions: BrokerStoreActions;
}
