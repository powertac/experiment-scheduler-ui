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
  cancelled: boolean;
  brokers: Broker[];
  weather: WeatherConfigurationData;
  baselineId: string|undefined;
  baseId: string|undefined;
  treatmentId: string|undefined;
  isValidTemplate: boolean;
}
