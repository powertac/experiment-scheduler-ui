import {Broker} from '@/domain/Broker/Broker';

export interface BrokerSet {
  id?: string;
  brokers: Broker[];
}
