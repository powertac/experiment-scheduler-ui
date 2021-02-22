import Vue from 'vue';
import {ActionContext} from 'vuex';
import {RestClient} from '@/api/RestClient';
import {RootStoreState} from '@/domain/types/RootStore';
import {NotificationLevel} from '@/domain/types/Notification';
import {Experiment} from '@/domain/Experiment/Experiment';
import {JobStoreState} from "@/domain/types/JobStore";

export interface ExperimentStore {
    state: ExperimentStoreState;
    getters: ExperimentGetters;
}

interface ExperimentStoreState {
    experiments: {[key: string]: Experiment};
}

interface ExperimentGetters {
    all: Experiment[];
}

export default {

    namespaced: true,

    state: {
        experiments: {},
    },

    getters: {
        all: (state: ExperimentStoreState) => {
            return Object.values(state.experiments);
        },
        one: (state: ExperimentStoreState) => (hash: string) => {
            for (const experiment of Object.values(state.experiments)) {
                if (experiment.hash === hash) {
                    return experiment;
                }
            }
            return null;
        },
    },

    mutations: {
        addExperiment: (state: ExperimentStoreState, experiment: Experiment) => {
            Vue.set(state.experiments, experiment.hash, experiment);
        },
        removeType: (state: ExperimentStoreState, experiment: Experiment) => {
            delete state.experiments[experiment.hash];
        },
    },

    actions: {
        refresh: (context: ActionContext<ExperimentStoreState, RootStoreState>) => {
            RestClient.experiments()
                .then((experiments: Experiment[]) => experiments.forEach(
                    (experiment) => context.commit('addExperiment', experiment)))
                .catch(() => context.dispatch(
                    'notify',
                    {level: NotificationLevel.error, message: 'Could not load experiments from remote server'},
                    {root: true},
                ));
        },
    },

};
