import {Broker} from '@/domain/Broker/Broker';

export interface GameSpec {
  name: string;
  baseGameId?: string;
  serverParameters: {[key: string]: string};
  brokers: Broker[];
}
