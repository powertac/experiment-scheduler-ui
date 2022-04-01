import {BrokerSet} from '@/domain/Broker/BrokerSet';
import {WeatherConfigurationData} from '@/domain/Weather/WeatherConfigurationData';
import {GameData} from '@/domain/Game/GameData';

export interface BaselineData {
  id: string;
  name: string;
  brokerSets: BrokerSet[];
  weatherConfigurations: WeatherConfigurationData[];
  games: GameData[];
  createdAt: number;
  commonParameters: {[key: string]: string};
}
