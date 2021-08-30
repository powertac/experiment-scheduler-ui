import jobs from '@/domain/JobStore';
import brokers from '@/domain/BrokerStore';
import experiments from '@/domain/Experiment/ExperimentStore';
import baselines from '@/domain/Baseline/BaselineStore';
import {RootStoreState} from '@/domain/types/RootStore';
import {ActionContext} from 'vuex';
import {ServerStatus} from '@/domain/types/Server';
import Vue from 'vue';
import {RestClient} from '@/api/RestClient';
import {Notification} from '@/domain/types/Notification';
import {ServerStatusListener} from '@/util/ServerStatusListener';
import { gameStore } from '@/domain/Game/GameStore';

let orchestratorServerStatusListener: ServerStatusListener|null = null;

export default {
    state: {
        notifications: [],
        orchestratorStatus: {
            running: false,
            healthy: false,
        },
    },
    modules: {
        jobs,
        brokers,
        experiments,
        baselines,
        games: gameStore,
    },
    getters: {
        orchestratorStatus: (state: RootStoreState) => {
            return state.orchestratorStatus;
        },
    },
    mutations: {
        setOrchestratorStatus: (state: RootStoreState, orchestratorStatus: ServerStatus) => {
            Vue.set(state, 'orchestratorStatus', orchestratorStatus);
        },
    },
    actions: {
        activateOrchestratorStatusListener: (context: ActionContext<RootStoreState, RootStoreState>) => {
            if (null === orchestratorServerStatusListener) {
                orchestratorServerStatusListener = new ServerStatusListener(() => {
                    RestClient.serverStatus()
                        .then((orchestratorStatus: ServerStatus) =>
                            context.commit('setOrchestratorStatus', orchestratorStatus))
                        .catch(() => context.commit('setOrchestratorStatus', {
                                running: false,
                                healthy: false,
                        }));
                });
            }
            orchestratorServerStatusListener.activate();
        },
        notify: (context: ActionContext<RootStoreState, RootStoreState>, notification: Notification) => {
            console.log(notification);
        },
    },
};
