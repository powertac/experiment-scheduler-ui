import {ActionContext, GetterTree} from 'vuex';
import {RootStoreState} from '@/domain/Store/RootStore';
import {Game} from '@/domain/Game/GameTypes';

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
