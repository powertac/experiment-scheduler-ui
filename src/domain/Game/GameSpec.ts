import {Broker} from '@/domain/Broker/Broker';
import {WeatherConfigurationData} from '@/domain/Weather/WeatherConfigurationData';

export interface GameSpec {
  name: string;
  baseGameId?: string;
  serverParameters: {[key: string]: string};
  brokers: Broker[];
  weather?: WeatherConfigurationData;
}
