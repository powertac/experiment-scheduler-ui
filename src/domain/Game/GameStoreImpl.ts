import Vue from 'vue';
import {ActionContext} from 'vuex';
import {RootStoreState} from '@/domain/Store/RootStore';
import {OrchestratorClient} from '@/api/OrchestratorClient';
import {AxiosError} from 'axios';
import {StompClient} from '@/api/StompClient';
import {GameStore, GameStoreGetters, GameStoreState} from '@/domain/Game/GameStore';
import {GameData} from '@/domain/Game/GameData';
import Game from '@/domain/Game/Game';
import {GamePage} from '@/api/GamePage';

const gameStoreImpl: GameStore = {
  namespaced: true,
  state: { games: {} },
  getters: {
    find: (state: GameStoreState) => (id: string): Game|null => {
      if (id in state.games) {
        return state.games[id];
      }
      return null;
    },
    findAll: (state: GameStoreState): Game[] => {
      return Object.values(state.games);
    },
    findSome: (state: GameStoreState) => (ids: string[]): Game[] => {
      return ids.map((id) => state.games[id]);
    },
  },
  mutations: {
    add: (state: GameStoreState, data: GameData): void => {
      const game: Game = new Game(data);
      Vue.set(state.games, game.id, game);
    },
    remove: (state: GameStoreState, game: Game): void => {
      Vue.delete(state.games, game.id);
    },
  },
  actions: {
    load: (context: ActionContext<GameStoreState, RootStoreState>, id: string): void => {
      OrchestratorClient.game(id)
        .then((game: GameData) => context.commit('add', game))
        .catch((error: AxiosError) => console.error(error));
    },
    loadNext: (context: ActionContext<GameStoreState, RootStoreState>, page: GamePage): void => {
      OrchestratorClient.gamePage(page.start, page.limit)
        .then((games) => games.forEach((game) => context.commit('add', game)))
        .catch((error: AxiosError) => console.error(error));
    },
    loadAll: (context: ActionContext<GameStoreState, RootStoreState>): void => {
      OrchestratorClient.games()
        .then((games: GameData[]) => games.forEach((game: GameData) => context.commit('add', game)))
        .catch((error: AxiosError) => console.error(error));
    },
    subscribe: (context: ActionContext<GameStoreState, RootStoreState>) => {
      StompClient.subscribe('/games', (game: GameData) => context.commit('add', game));
    },
  },
};

export { gameStoreImpl };
