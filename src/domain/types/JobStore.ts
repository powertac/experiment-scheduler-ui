import {GetterTree, Module} from 'vuex';
import {RootStoreState} from '@/domain/types/RootStore';
import {Job, JobState} from '@/domain/types/Job.ts';

type JobsGetter = (state: JobStoreState, getters: JobStoreModuleGetters) => Job[];

export interface JobStoreModuleGetters extends GetterTree<JobStoreState, RootStoreState> {
    jobs: JobsGetter;
    removed: JobsGetter;
    pending: JobsGetter;
    queued: JobsGetter;
    running: JobsGetter;
    completed: JobsGetter;
    failed: JobsGetter;
    exists: (state: JobStoreState) => (id: string) => boolean;
    withState: (state: JobStoreState, getters: JobStoreModuleGetters) => (jobState: JobState) => Job[];
}

export interface JobStoreState {
    jobs: {[key: string]: Job};
}

export interface JobStoreModule extends Module<JobStoreState, RootStoreState> {
    state: JobStoreState;
    getters: JobStoreModuleGetters;
}

export interface JobGetters {
    job: Job|null;
    jobs: Job[];
    removed: Job[];
    pending: Job[];
    queued: Job[];
    running: Job[];
    completed: Job[];
    failed: Job[];
    exists: (id: string) => boolean;
    withState: (jobState: JobState) => Job[];
}

export interface JobStore {
    state: JobStoreState;
    getters: JobGetters;
}
