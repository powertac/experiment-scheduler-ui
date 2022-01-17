import {GameInterface} from '@/domain/Game/GameInterface';
import Vue from 'vue';
import {ActionContext} from 'vuex';
import {RootStoreState} from '@/domain/Store/RootStore';
import {OrchestratorClient} from '@/api/OrchestratorClient';
import {AxiosError} from 'axios';
import {StompClient} from '@/api/StompClient';
import {GameStore, GameStoreState} from '@/domain/Game/GameStore';
import {GameData} from '@/domain/Game/GameData';
import {create} from '@/domain/Game/GameFactory';

const gameStoreImpl: GameStore = {
  namespaced: true,
  state: { games: {} },
  getters: {
    find: (state: GameStoreState) => (id: string): GameInterface|null => {
      if (id in state.games) {
        return state.games[id];
      }
      return null;
    },
    findAll: (state: GameStoreState): GameInterface[] => {
      return Object.values(state.games);
    },
  },
  mutations: {
    add: (state: GameStoreState, data: GameData): void => {
      const game: GameInterface = create(data);
      Vue.set(state.games, game.id, game);
    },
    remove: (state: GameStoreState, game: GameInterface): void => {
      Vue.delete(state.games, game.id);
    },
  },
  actions: {
    load: (context: ActionContext<GameStoreState, RootStoreState>, id: string): void => {
      OrchestratorClient.game(id)
        .then((game: GameData) => context.commit('add', game))
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
