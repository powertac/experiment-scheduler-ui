import {ActionContext, ActionTree, GetterTree, Module, MutationTree} from 'vuex';
import {RootStoreState} from '@/domain/Store/RootStore';
import {GameData} from '@/domain/Game/GameData';
import Game from '@/domain/Game/Game';
import {GamePage} from '@/api/GamePage';

export interface GameStore extends Module<GameStoreState, RootStoreState> {
  namespaced: boolean;
  state: GameStoreState;
  getters: GameStoreGetters;
  mutations: GameStoreMutations;
  actions: GameStoreActions;
}

export interface GameStoreState {
  games: {[key: string]: Game};
}

export interface GameStoreGetters extends GetterTree<GameStoreState, RootStoreState> {
  find: (state: GameStoreState, getters: GameStoreGetters) => (id: string) => Game|null;
  findSome: (state: GameStoreState, getters: GameStoreGetters) => (ids: string[]) => Game[];
  findAll: (state: GameStoreState, getters: GameStoreGetters) => Game[];
}

export interface GameStoreMutations extends MutationTree<GameStoreState> {
  add: (state: GameStoreState, game: GameData) => void;
  remove: (state: GameStoreState, game: Game) => void;
}

export interface GameStoreActions extends ActionTree<GameStoreState, RootStoreState> {
  load: (context: ActionContext<GameStoreState, RootStoreState>, id: string) => void;
  loadNext: (context: ActionContext<GameStoreState, RootStoreState>, page: GamePage) => void;
  loadAll: (context: ActionContext<GameStoreState, RootStoreState>) => void;
  subscribe: (context: ActionContext<GameStoreState, RootStoreState>) => void;
}
