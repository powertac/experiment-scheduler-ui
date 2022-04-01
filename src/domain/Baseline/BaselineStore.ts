import {BaselineData} from '@/domain/Baseline/BaselineData';
import {ActionContext, ActionTree, GetterTree, Module, MutationTree} from 'vuex';
import {RootStoreState} from '@/domain/Store/RootStore';
import {Baseline} from '@/domain/Baseline/Baseline';

export interface BaselineStoreState {
  baselines: { [key: string]: Baseline };
}

export interface BaselineStoreGetters extends GetterTree<BaselineStoreState, RootStoreState> {
  find: (state: BaselineStoreState) => (id: string) => Baseline|null;
  findAll: (state: BaselineStoreState) => Baseline[];
}

export interface BaselineStoreMutations extends MutationTree<BaselineStoreState> {
  add: (state: BaselineStoreState, baseline: BaselineData) => void;
}

export interface BaselineStoreActions extends ActionTree<BaselineStoreState, RootStoreState> {
  subscribe: (context: ActionContext<BaselineStoreState, RootStoreState>) => void;
  loadAll: (context: ActionContext<BaselineStoreState, RootStoreState>) => void;
}

export interface BaselineStore extends Module<BaselineStoreState, RootStoreState> {
  namespaced: boolean;
  state: BaselineStoreState;
  getters: BaselineStoreGetters;
  mutations: BaselineStoreMutations;
  actions: BaselineStoreActions;
}
