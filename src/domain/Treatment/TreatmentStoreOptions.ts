import {ActionContext, ActionTree, GetterTree, Module, MutationTree} from 'vuex';
import {RootStoreState} from '@/domain/Store/RootStore';
import {Treatment, TreatmentData} from '@/domain/Treatment/Treatment';

export interface TreatmentStoreState {
  treatments: { [id: string]: Treatment<any> };
}

export interface TreatmentStoreGetters extends GetterTree<TreatmentStoreState, RootStoreState> {
  find: (state: TreatmentStoreState) => (id: string) => Treatment<any>|null;
  findAll: (state: TreatmentStoreState) => Array<Treatment<any>>;
}

export interface TreatmentStoreMutations extends MutationTree<TreatmentStoreState> {
  add: (state: TreatmentStoreState, treatment: TreatmentData) => void;
}

export interface TreatmentStoreActions extends ActionTree<TreatmentStoreState, RootStoreState> {
  subscribe: (context: ActionContext<TreatmentStoreState, RootStoreState>) => void;
  loadAll: (context: ActionContext<TreatmentStoreState, RootStoreState>) => void;
}

export interface TreatmentStoreOptions extends Module<TreatmentStoreState, RootStoreState> {
  namespaced: boolean;
  state: TreatmentStoreState;
  getters: TreatmentStoreGetters;
  mutations: TreatmentStoreMutations;
  actions: TreatmentStoreActions;
}
