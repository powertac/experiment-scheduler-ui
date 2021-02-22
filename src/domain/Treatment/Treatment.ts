import {BrokerSpec} from '@/domain/Broker/BrokerSpec';
import {Parameter} from '@/domain/types/Parameter';

export interface Treatment {
    type: string;
    mutation: BrokerMutation|ParameterMutation;
}

export enum TreatmentType {
    ServerParameter = 'Set server parameter',
    BrokerSet = 'Change broker set',
}

export interface BrokerMutation {
    action: BrokerMutationAction;
    broker: BrokerSpec;
}

export enum BrokerMutationAction {
    add = 'add',
    remove = 'remove',
}

export interface ParameterMutation {
    parameters: Parameter[];
}
