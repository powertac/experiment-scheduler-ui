import {Game, GameStore, GameStoreState} from '@/domain/Game/GameTypes';
import Vue from 'vue';
import {ActionContext} from 'vuex';
import {RootStoreState} from '@/domain/types/RootStore';
import {RestClient} from '@/api/RestClient';
import {AxiosError} from 'axios';
import GameImpl from '@/domain/Game/GameImpl';
import {StompClient} from '@/api/StompClient';

const gameStore: GameStore = {
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
  },
  mutations: {
    add: (state: GameStoreState, data: Game): void => {
      const game: Game = new GameImpl(
        data.id,
        data.bootstrap,
        data.brokers,
        data.name,
        data.runs,
        data.seed,
        data.serverParameters,
        data.createdAt,
        data.files,
        data.cancelled);
      Vue.set(state.games, game.id, game);
    },
  },
  actions: {
    load: (context: ActionContext<GameStoreState, RootStoreState>, id: string): void => {
      RestClient.game(id)
        .then((game: Game) => context.commit('add', game))
        .catch((error: AxiosError) => console.error(error));
    },
    loadAll: (context: ActionContext<GameStoreState, RootStoreState>): void => {
      RestClient.games()
        .then((games: Game[]) => games.forEach((game: Game) => context.commit('add', game)))
        .catch((error: AxiosError) => console.error(error));
    },
    subscribe: (context: ActionContext<GameStoreState, RootStoreState>) => {
      StompClient.subscribe('/games', (game: Game) => context.commit('add', game));
    },
  },
};

export { gameStore };
