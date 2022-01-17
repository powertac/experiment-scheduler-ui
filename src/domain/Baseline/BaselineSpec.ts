import {BrokerSet} from '@/domain/Broker/BrokerSet';
import {WeatherConfigurationData} from '@/domain/Weather/WeatherConfigurationData';

export interface BaselineSpec {
  name: string;
  commonParameters: {[key: string]: string};
  brokerSets: BrokerSet[];
  weatherConfigurations: WeatherConfigurationData[];
}
