import {ActionContext, ActionTree, GetterTree, ModuleTree, MutationTree, StoreOptions} from 'vuex';
import {Notification} from '@/domain/types/Notification';
import {BrokerStore} from '@/domain/Broker/BrokerStore';
import {ServerStatus} from '@/domain/Service/ServerStatus';
import {GameStore} from '@/domain/Game/GameStore';
import {WeatherLocation} from '@/domain/Location/WeatherLocation';
import {BaselineStore} from '@/domain/Baseline/BaselineStore';
import {TreatmentStoreOptions} from '@/domain/Treatment/TreatmentStoreOptions';

export interface RootStoreOptions extends StoreOptions<RootStoreState> {
    modules: RootStoreModules;
    getters: RootStoreGetters;
    mutations: RootStoreMutations;
    actions: RootStoreActions;
}

export interface RootStoreState {
    notifications: Notification[];
    orchestratorStatus: ServerStatus;
    time: number;
    supportedParameters: string[];
    availableLocations: WeatherLocation[];
    authenticated: boolean;
}

export interface RootStoreModules extends ModuleTree<RootStoreState> {
    baselines: BaselineStore;
    brokers: BrokerStore;
    games: GameStore;
    treatments: TreatmentStoreOptions;
}

export interface RootStoreGetters extends GetterTree<RootStoreState, RootStoreState> {
    orchestratorStatus: (state: RootStoreState, getters: RootStoreGetters) => ServerStatus;
    time: (state: RootStoreState, getters: RootStoreGetters) => number;
    supportedParameters: (state: RootStoreState, getters: RootStoreGetters) => string[];
    availableLocations: (state: RootStoreState, getters: RootStoreGetters) => WeatherLocation[];
    isAuthenticated: (state: RootStoreState, getters: RootStoreGetters) => boolean;
}

export interface RootStoreMutations extends MutationTree<RootStoreState> {
    setOrchestratorStatus: (state: RootStoreState, orchestratorStatus: ServerStatus) => void;
    setTime: (state: RootStoreState, time: number) => void;
    setSupportedParameters: (state: RootStoreState, parameters: string[]) => void;
    setAvailableLocations: (state: RootStoreState, locations: WeatherLocation[]) => void;
    setAuthenticated: (state: RootStoreState, authenticated: boolean) => void;
}

export interface RootStoreActions extends ActionTree<RootStoreState, RootStoreState> {
    activateOrchestratorStatusListener: (context: ActionContext<RootStoreState, RootStoreState>) => void;
    notify: (context: ActionContext<RootStoreState, RootStoreState>, notification: Notification) => void;
    startClock: (context: ActionContext<RootStoreState, RootStoreState>) => void;
    loadSupportedParameters: (context: ActionContext<RootStoreState, RootStoreState>) => void;
    loadAvailableLocations: (context: ActionContext<RootStoreState, RootStoreState>) => void;
}
