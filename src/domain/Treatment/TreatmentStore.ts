import Vue from 'vue';
import {ActionContext} from 'vuex';
import {RootStoreState} from '@/domain/Store/RootStore';
import {AxiosError} from 'axios';
import {StompClient} from '@/api/StompClient';
import {TreatmentStoreOptions, TreatmentStoreState} from '@/domain/Treatment/TreatmentStoreOptions';
import {Treatment, TreatmentData} from '@/domain/Treatment/Treatment';
import api from '@/api/api';

const treatmentStore: TreatmentStoreOptions = {
  namespaced: true,
  state: { treatments: {} },
  getters: {
    find: (state: TreatmentStoreState) => (id: string): Treatment<any>|null =>
      id in state.treatments ? state.treatments[id] : null,
    findAll: (state: TreatmentStoreState): Array<Treatment<any>> =>
      Object.values(state.treatments),
  },
  mutations: {
    add: (state: TreatmentStoreState, data: TreatmentData): void => {
      const treatment = new Treatment(data);
      Vue.set(state.treatments, treatment.id, treatment);
    },
  },
  actions: {
    loadAll: (context: ActionContext<TreatmentStoreState, RootStoreState>): void => {
      api.orchestrator.treatments.getAll()
        .then((treatments: TreatmentData[]) =>
          treatments.forEach((treatment: TreatmentData) =>
            context.commit('add', treatment)))
        .catch((error: AxiosError) => console.error(error));
    },
    subscribe: (context: ActionContext<TreatmentStoreState, RootStoreState>) => {
      StompClient.subscribe('/treatments', (treatment: TreatmentData) => context.commit('add', treatment));
    },
  },
};

export { treatmentStore };
