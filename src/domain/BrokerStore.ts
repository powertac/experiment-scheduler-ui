import Vue from 'vue';
import {ActionContext} from 'vuex';
import {StompClient} from '@/api/StompClient';
import {RestClient} from '@/api/RestClient';
import {JobStoreState} from '@/domain/types/JobStore';
import {RootStoreState} from '@/domain/types/RootStore';
import {NotificationLevel} from '@/domain/types/Notification';
import {BrokerType} from '@/domain/types/Broker';
import {BrokerGetters, BrokerStoreState} from '@/domain/types/BrokerStore';

export default {

    namespaced: true,

    state: {
        types: {},
    },

    getters: {
        types: (state: BrokerStoreState) => {
            return Object.values(state.types).sort((firstType: BrokerType, secondType: BrokerType) => {
                return firstType.name.localeCompare(secondType.name);
            });
        },
        typeExists: (state: BrokerStoreState, getters: BrokerGetters) => (brokerTypeName: string) => {
            const brokerType = state.types[brokerTypeName];
            return  null !== brokerType && undefined !== brokerType;
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
        listen: (context: ActionContext<JobStoreState, RootStoreState>) => {
            StompClient.subscribe('/brokers/types', (brokerType: BrokerType) => {
                if (!context.getters.typeExists(brokerType.name)) {
                    context.commit('updateType', brokerType);
                    return;
                }
                context.commit('addType', brokerType);
            });
        },
    },

};
