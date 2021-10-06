import {ActionContext, ActionTree, GetterTree, Module, MutationTree} from 'vuex';
import {RootStoreState} from '@/domain/Store/RootStore';
import {Game} from '@/domain/Game/GameTypes';

export interface GameStoreState {
  games: {[key: string]: Game};
}

export interface GameStoreGetters extends GetterTree<GameStoreState, RootStoreState> {
  find: (state: GameStoreState, getters: GameStoreGetters) => (id: string) => Game|null;
  findAll: (state: GameStoreState, getters: GameStoreGetters) => Game[];
}

export interface GameStoreActions extends ActionTree<GameStoreState, RootStoreState> {
  load: (context: ActionContext<GameStoreState, RootStoreState>, id: string) => void;
  loadAll: (context: ActionContext<GameStoreState, RootStoreState>) => void;
  subscribe: (context: ActionContext<GameStoreState, RootStoreState>) => void;
}

export interface GameStoreMutations extends MutationTree<GameStoreState> {
  add: (state: GameStoreState, game: Game) => void;
}

export interface GameStore extends Module<GameStoreState, RootStoreState> {
  namespaced: boolean;
  state: GameStoreState;
  getters: GameStoreGetters;
  mutations: GameStoreMutations;
  actions: GameStoreActions;
}
