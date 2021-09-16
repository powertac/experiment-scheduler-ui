import Vue from 'vue';
import {ActionContext} from 'vuex';
import {StompClient} from '@/api/StompClient';
import {RestClient} from '@/api/RestClient';
import {JobStoreState} from '@/domain/types/JobStore';
import {RootStoreState} from '@/domain/types/RootStore';
import {NotificationLevel} from '@/domain/types/Notification';
import {BrokerType} from '@/domain/types/Broker';
import {BrokerStore, BrokerStoreState} from '@/domain/types/BrokerStore';
import {Broker, BrokerImpl} from '@/domain/Broker/Broker';

const brokerStore: BrokerStore = {
  namespaced: true,
  state: {
    types: {},
    brokers: {},
  },
  getters: {
    types: (state: BrokerStoreState) => {
      return Object.values(state.types).sort((firstType: BrokerType, secondType: BrokerType) => {
        return firstType.name.localeCompare(secondType.name);
      });
    },
    typeExists: (state: BrokerStoreState) => (brokerTypeName: string) => {
      const brokerType = state.types[brokerTypeName];
      return null !== brokerType && undefined !== brokerType;
    },
    findAll: (state: BrokerStoreState) => {
      return Object.values(state.brokers)
        .sort((a, b) => a.name.localeCompare(b.name));
    },
  },
  mutations: {
    addType: (state: BrokerStoreState, brokerType: BrokerType) => {
      Vue.set(state.types, brokerType.name, brokerType);
    },
    updateType: (state: BrokerStoreState, brokerType: BrokerType) => {
      const existingType = state.types[brokerType.name];
      if (undefined === existingType || null === existingType) {
        return;
      }
      Vue.set(existingType, 'image', brokerType.image);
    },
    removeType: (state: BrokerStoreState, brokerType: BrokerType) => {
      delete state.types[brokerType.name];
    },
    add: (state: BrokerStoreState, data: Broker) => {
      if (undefined === data.id) {
        console.error('cannot add broker due to missing id');
        return;
      }
      Vue.set(state.brokers, data.id, new BrokerImpl(data.id, data.name, data.version, data.imageTag, data.enabled));
    },
  },
  actions: {
    refresh: (context: ActionContext<JobStoreState, RootStoreState>) => {
      RestClient.brokerTypes()
        .then((types: BrokerType[]) => {
          types.filter((type) => type.name !== 'samplebroker')
            .forEach((brokerType: BrokerType) => context.commit('addType', brokerType));
        })
        .catch(() => context.dispatch(
          'notify',
          {level: NotificationLevel.error, message: 'Could not load broker types from remote server'},
          {root: true},
        ));
    },
    subscribe: (context: ActionContext<JobStoreState, RootStoreState>) => {
      StompClient.subscribe('/brokers', (broker: Broker) => context.commit('add', broker));
    },
    loadAll: (context: ActionContext<BrokerStoreState, RootStoreState>) => {
      RestClient.brokers()
        .then((brokers) => brokers.forEach((broker) => context.commit('add', broker)))
        .catch((error) => console.error(error));
    },
  },
};

export {brokerStore};
