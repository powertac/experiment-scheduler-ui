import {GameRun} from '@/domain/Game/GameRun';
import {Broker} from '@/domain/Broker/Broker';
import {WeatherConfigurationData} from '@/domain/Weather/WeatherConfigurationData';

export interface GameData {
  id: string;
  bootstrap: File;
  name: string;
  runs: GameRun[];
  seed: File;
  serverParameters: {[key: string]: string};
  createdAt: number;
  files: { [role: string]: string };
  cancelled: boolean;
  brokers: Broker[];
  weather: WeatherConfigurationData;
  baseline: string;
}
