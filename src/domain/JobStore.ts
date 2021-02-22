import Vue from 'vue';
import {ActionContext} from 'vuex';
import {StompClient} from '@/api/StompClient';
import {RestClient} from '@/api/RestClient';
import {JobGetters, JobStoreState} from '@/domain/types/JobStore';
import {Job, JobState} from '@/domain/types/Job';
import {RootStoreState} from '@/domain/types/RootStore';
import {NotificationLevel} from '@/domain/types/Notification';
import {JobStateHelper} from '@/domain/Job';

export default {

    namespaced: true,

    state: {
        jobs: {},
    },

    getters: {
        jobs: (state: JobStoreState) => {
            return Object.values(state.jobs)
                .filter((job) => !job.status.removed)
                .sort((a, b) => {
                    return JobStateHelper.getOrderIndex(b.status.state) - JobStateHelper.getOrderIndex(a.status.state);
                });
        },
        job: (state: JobStoreState) => (id: string) => {
            for (const job of Object.values(state.jobs)) {
                if (job.id === id) {
                    return job;
                }
            }
            return null;
        },
        removed: (state: JobStoreState) => {
            return Object.entries(state.jobs)
                .map((entry) => entry[1])
                .filter((job) => job.status.removed);
        },
        withState: (state: JobStoreState, getters: JobGetters) => (jobState: JobState) => {
            return getters.jobs.filter((job) => job.status.state === jobState);
        },
        pending: (state: JobStoreState, getters: JobGetters) => {
            return getters.withState(JobState.pending);
        },
        queued: (state: JobStoreState, getters: JobGetters) => {
            return getters.withState(JobState.queued);
        },
        running: (state: JobStoreState, getters: JobGetters) => {
            return getters.withState(JobState.running);
        },
        completed: (state: JobStoreState, getters: JobGetters) => {
            return getters.withState(JobState.completed);
        },
        failed: (state: JobStoreState, getters: JobGetters) => {
            return getters.withState(JobState.failed);
        },
        exists: (state: JobStoreState) => (id: string) => {
            return state.jobs[id] !== undefined;
        },
    },

    mutations: {
        add: (state: JobStoreState, job: Job) => {
            Vue.set(state.jobs, job.id, job);
        },
        update: (state: JobStoreState, job: Job) => {
            const existingJob =  state.jobs[job.id];
            if (undefined === existingJob) {
                return;
            }
            Vue.set(existingJob, 'name', job.name);
            Vue.set(existingJob, 'status', job.status);
            if (undefined !== job.log) {
                Vue.set(existingJob, 'log', job.log);
            }
        },
        remove: (state: JobStoreState, job: Job) => {
            delete state.jobs[job.id];
        },
    },

    actions: {
        load: (context: ActionContext<JobStoreState, RootStoreState>, id: string) => {
            RestClient.job(id)
                .then((job: Job) => context.commit('add', job))
                .catch((error) => {console.log(error); context.dispatch(
                    'notify',
                    {
                        level: NotificationLevel.error,
                        message: 'Could not load job with id=' + id + ' from remote server',
                    },
                    {root: true},
                )});
        },
        refresh: (context: ActionContext<JobStoreState, RootStoreState>) => {
            RestClient.jobs()
                .then((allJobs: Job[]) => {
                    allJobs.forEach((job: Job) => context.commit('add', job));
                })
                .catch(() => context.dispatch(
                    'notify',
                    {level: NotificationLevel.error, message: 'Could not load jobs from remote server'},
                    {root: true},
                ));
        },
        listen: (context: ActionContext<JobStoreState, RootStoreState>) => {
            StompClient.subscribe('/jobs', (job: Job) => {
                if (context.getters.exists(job.id)) {
                    context.commit('update', (job));
                    return;
                }
                context.commit('add', job);
            });
        },
    },

};
