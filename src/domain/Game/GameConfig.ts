import {Broker} from '@/domain/Broker/Broker';
import {WeatherConfigurationData} from '@/domain/Weather/WeatherConfigurationData';

export interface GameConfig {
  id?: string;
  name?: string;
  brokers: Broker[];
  parameters: {[key: string]: string};
  weather?: WeatherConfigurationData;
}
