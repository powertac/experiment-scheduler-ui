import Vue from 'vue';
import {ActionContext} from 'vuex';
import {StompClient} from '@/api/StompClient';
import {OrchestratorClient} from '@/api/OrchestratorClient';
import {RootStoreState} from '@/domain/Store/RootStore';
import {BrokerStore, BrokerStoreState} from '@/domain/Broker/BrokerStore';
import {Broker, BrokerImpl} from '@/domain/Broker/Broker';

const brokerStoreImpl: BrokerStore = {
  namespaced: true,
  state: {
    brokers: {},
  },
  getters: {
    findAll: (state: BrokerStoreState) => {
      return Object.values(state.brokers)
        .sort((a, b) => a.name.localeCompare(b.name));
    },
  },
  mutations: {
    add: (state: BrokerStoreState, data: Broker) => {
      if (undefined === data.id) {
        console.error('cannot add broker due to missing id');
        return;
      }
      Vue.set(state.brokers, data.id, new BrokerImpl(data.id, data.name, data.version, data.imageTag, data.enabled));
    },
  },
  actions: {
    subscribe: (context: ActionContext<BrokerStoreState, RootStoreState>) => {
      StompClient.subscribe('/brokers', (broker: Broker) => context.commit('add', broker));
    },
    loadAll: (context: ActionContext<BrokerStoreState, RootStoreState>) => {
      OrchestratorClient.brokers()
        .then((brokers) => brokers.forEach((broker) => context.commit('add', broker)))
        .catch((error) => console.error(error));
    },
  },
};

export {brokerStoreImpl};
