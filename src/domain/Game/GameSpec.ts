import {BrokerSpec} from '@/domain/Broker/BrokerSpec';
import {Parameter} from '@/domain/types/Parameter';

export interface GameSpec {
    id?: string;
    name?: string;
    serverParameters: Parameter[];
    brokers: BrokerSpec[];
    bootstrapFile?: string;
    seedFile?: string;
}
