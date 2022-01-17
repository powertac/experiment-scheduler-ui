import {BaselineStore, BaselineStoreState} from '@/domain/Baseline/BaselineStore';
import {BaselineData} from '@/domain/Baseline/BaselineData';
import Vue from 'vue';
import {ActionContext} from 'vuex';
import {RootStoreState} from '@/domain/Store/RootStore';
import {StompClient} from '@/api/StompClient';
import {OrchestratorClient} from '@/api/OrchestratorClient';
import {Baseline} from '@/domain/Baseline/Baseline';

const baselineStoreImpl: BaselineStore = {
  namespaced: true,
  state: {
    baselines: {},
  },
  getters: {
    find: (state: BaselineStoreState) => (id: string): Baseline|null => {
      if (id in state.baselines) {
        return state.baselines[id];
      }
      return null;
    },
    findAll: (state: BaselineStoreState) => {
      return Object.values(state.baselines)
        .sort((a, b) => a.name.localeCompare(b.name));
    },
  },
  mutations: {
    add: (state: BaselineStoreState, baseline: BaselineData) => {
      if (undefined === baseline.id) {
        console.error('cannot add broker due to missing id');
        return;
      }
      Vue.set(state.baselines, baseline.id, new Baseline(baseline));
    },
  },
  actions: {
    subscribe: (context: ActionContext<BaselineStoreState, RootStoreState>) => {
      StompClient.subscribe('/baselines', (baseline: BaselineData) => context.commit('add', baseline));
    },
    loadAll: (context: ActionContext<BaselineStoreState, RootStoreState>) => {
      OrchestratorClient.baselines()
        .then((baselines) => baselines.forEach((baseline) => context.commit('add', baseline)))
        .catch((error) => console.error(error));
    },
  },
};

export {baselineStoreImpl};
