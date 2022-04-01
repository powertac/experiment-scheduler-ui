import {BaselineData} from '@/domain/Baseline/BaselineData';
import {WeatherConfigurationData} from '@/domain/Weather/WeatherConfigurationData';
import {BrokerSet} from '@/domain/Broker/BrokerSet';
import Game from '@/domain/Game/Game';

export class Baseline {

  public id: string;
  public name: string;
  public brokerSets: BrokerSet[];
  public weatherConfigurations: WeatherConfigurationData[];
  public games: Game[];
  public createdAt: number;
  commonParameters: {[key: string]: string};

  constructor(data: BaselineData) {
    this.id = data.id;
    this.name = data.name;
    this.brokerSets = data.brokerSets;
    this.weatherConfigurations = data.weatherConfigurations;
    this.games = data.games.map((gameData) => new Game(gameData));
    this.createdAt = data.createdAt;
    this.commonParameters = data.commonParameters;
  }

  get completedGames(): Game[] {
    return this.games.filter((g) => g.status === 'completed');
  }

  get failedGames(): Game[] {
    return this.games.filter((g) => g.status === 'failed');
  }

  get progress(): number {
    if (this.games.length < 1) {
      return 0;
    }
    return this.completedGames.length / this.games.length;
  }

  get isRunning(): boolean {
    return this.games.filter((g) => g.status === 'running').length > 0;
  }

  get status(): string {
    if (this.progress === 1) {
      return 'completed';
    } else if (this.isRunning) {
      return 'running';
    } else if (this.failedGames.length > 0) {
      return 'failed';
    } else {
      return 'queued';
    }
  }

}
