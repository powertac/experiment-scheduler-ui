import {BrokerSet} from '@/domain/Broker/BrokerSet';
import {WeatherConfigurationData} from '@/domain/Weather/WeatherConfigurationData';
import Game from '@/domain/Game/Game';

export interface BaselineData {
  id: string;
  name: string;
  brokerSets: BrokerSet[];
  weatherConfigurations: WeatherConfigurationData[];
  games: Game[];
  createdAt: number;
  commonParameters: {[key: string]: string};
}
