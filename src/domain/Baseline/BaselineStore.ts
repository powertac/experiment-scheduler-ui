import Vue from 'vue';
import {ActionContext} from 'vuex';
import {RestClient} from '@/api/RestClient';
import {RootStoreState} from '@/domain/types/RootStore';
import {NotificationLevel} from '@/domain/types/Notification';
import {Baseline} from '@/domain/Baseline/Baseline';

export interface BaselineStore {
  state: BaselineStoreState;
  getters: BaselineGetters;
}

interface BaselineStoreState {
  baselines: {[key: string]: Baseline};
}

interface BaselineGetters {
  all: Baseline[];
}

export default {
  namespaced: true,
  state: {
    baselines: {},
  },
  getters: {
    all: (state: BaselineStoreState) => {
      return Object.values(state.baselines);
    },
    one: (state: BaselineStoreState) => (id: string) => {
      return state.baselines[id];
    },
  },
  mutations: {
    addBaseline: (state: BaselineStoreState, baseline: Baseline) => {
      Vue.set(state.baselines, baseline.id, baseline);
    },
    removeBaseline: (state: BaselineStoreState, baseline: Baseline) => {
      delete state.baselines[baseline.id];
    },
  },
  actions: {
    refresh: (context: ActionContext<BaselineStoreState, RootStoreState>) => {
      RestClient.baselines()
        .then((baselines: Baseline[]) => baselines.forEach(
          (baseline) => context.commit('addBaseline', baseline)))
        .catch(() => context.dispatch(
          'notify',
          {level: NotificationLevel.error, message: 'Could not load baselines from remote server'},
          {root: true},
        ));
    },
  },
};
