import {Store} from 'vuex';
import {Notification} from '@/domain/types/Notification';
import {JobStore} from '@/domain/types/JobStore';
import {BrokerStore} from '@/domain/types/BrokerStore';
import {ServerStatus} from '@/domain/types/Server';
import {ExperimentStore} from '@/domain/Experiment/ExperimentStore';

export interface RootStoreState {
    notifications: Notification[];
    orchestratorStatus: ServerStatus;
}

export interface RootStore extends Store<RootStoreState> {
    jobs: JobStore;
    brokers: BrokerStore;
    experiments: ExperimentStore;
}
