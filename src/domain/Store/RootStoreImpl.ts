import {brokerStoreImpl} from '@/domain/Broker/BrokerStoreImpl';
import {RootStoreState} from '@/domain/Store/RootStore';
import {ActionContext} from 'vuex';
import {ServerStatus} from '@/domain/Service/ServerStatus';
import Vue from 'vue';
import {RestClient} from '@/api/RestClient';
import {Notification} from '@/domain/types/Notification';
import {ServerStatusListener} from '@/util/ServerStatusListener';
import {gameStoreImpl} from '@/domain/Game/GameStoreImpl';
import moment from 'moment';

let orchestratorServerStatusListener: ServerStatusListener | null = null;

export default {
  state: {
    notifications: [],
    orchestratorStatus: {
      running: false,
      healthy: false,
    },
    time: moment.now(),
  },
  modules: {
    brokers: brokerStoreImpl,
    games: gameStoreImpl,
  },
  getters: {
    orchestratorStatus: (state: RootStoreState) => {
      return state.orchestratorStatus;
    },
    time: (state: RootStoreState) => {
      return state.time;
    },
  },
  mutations: {
    setOrchestratorStatus: (state: RootStoreState, orchestratorStatus: ServerStatus) => {
      Vue.set(state, 'orchestratorStatus', orchestratorStatus);
    },
    setTime: (state: RootStoreState, time: number) => {
      Vue.set(state, 'time', time);
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
    startClock: (context: ActionContext<RootStoreState, RootStoreState>) => {
      setInterval(() => context.commit('setTime', moment.now()), 1000);
    },
  },
};
