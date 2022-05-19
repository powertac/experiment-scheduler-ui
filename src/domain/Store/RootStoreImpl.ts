import {brokerStoreImpl} from '@/domain/Broker/BrokerStoreImpl';
import {RootStoreOptions, RootStoreState} from '@/domain/Store/RootStore';
import Vuex, {ActionContext} from 'vuex';
import {ServerStatus} from '@/domain/Service/ServerStatus';
import Vue from 'vue';
import {OrchestratorClient} from '@/api/OrchestratorClient';
import {Notification} from '@/domain/types/Notification';
import {ServerStatusListener} from '@/util/ServerStatusListener';
import {gameStoreImpl} from '@/domain/Game/GameStoreImpl';
import moment from 'moment';
import {WeatherLocation} from '@/domain/Location/WeatherLocation';
import {WeatherServerClient} from '@/api/WeatherServerClient';
import {WeatherLocationImpl} from '@/domain/Location/WeatherLocationImpl';
import {baselineStoreImpl} from '@/domain/Baseline/BaselineStoreImpl';
import {treatmentStore} from '@/domain/Treatment/TreatmentStore';

let orchestratorServerStatusListener: ServerStatusListener | null = null;

Vue.use(Vuex);

const rootStoreOptions: RootStoreOptions = {
  state: {
    notifications: [],
    orchestratorStatus: {
      running: false,
      healthy: false,
    },
    time: moment.now(),
    supportedParameters: [],
    availableLocations: [],
  },
  modules: {
    baselines: baselineStoreImpl,
    brokers: brokerStoreImpl,
    games: gameStoreImpl,
    treatments: treatmentStore,
  },
  getters: {
    orchestratorStatus: (state: RootStoreState) => {
      return state.orchestratorStatus;
    },
    time: (state: RootStoreState) => {
      return state.time;
    },
    supportedParameters: (state: RootStoreState) => {
      return state.supportedParameters;
    },
    availableLocations: (state: RootStoreState) => {
      return state.availableLocations;
    },
  },
  mutations: {
    setOrchestratorStatus: (state: RootStoreState, orchestratorStatus: ServerStatus) => {
      Vue.set(state, 'orchestratorStatus', orchestratorStatus);
    },
    setTime: (state: RootStoreState, time: number) => {
      Vue.set(state, 'time', time);
    },
    setSupportedParameters: (state: RootStoreState, parameters: string[]) => {
      Vue.set(state, 'supportedParameters', parameters);
    },
    setAvailableLocations: (state: RootStoreState, locations: WeatherLocation[]) => {
      Vue.set(state, 'availableLocations', locations.map((l) => new WeatherLocationImpl(
        l.name,
        l.minReportTime,
        l.maxReportTime,
        l.minForecastTime,
        l.maxForecastTime)));
    },
  },
  actions: {
    activateOrchestratorStatusListener: (context: ActionContext<RootStoreState, RootStoreState>) => {
      if (null === orchestratorServerStatusListener) {
        orchestratorServerStatusListener = new ServerStatusListener(() => {
          OrchestratorClient.serverStatus()
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
    loadSupportedParameters: (context: ActionContext<RootStoreState, RootStoreState>) => {
      OrchestratorClient.supportedParams()
        .then((params) => context.commit('setSupportedParameters', params.sort()))
        .catch((e) => console.error(e));
    },
    loadAvailableLocations: (context: ActionContext<RootStoreState, RootStoreState>) => {
      WeatherServerClient.availableLocations()
        .then((locations: WeatherLocation[]) => context.commit('setAvailableLocations', locations))
        .catch((e) => console.error(e));
    },
  },
};

export default new Vuex.Store(rootStoreOptions);
