import {BaselineData} from '@/domain/Baseline/BaselineData';
import {WeatherConfigurationData} from '@/domain/Weather/WeatherConfigurationData';
import {BrokerSet} from '@/domain/Broker/BrokerSet';
import Game from '@/domain/Game/Game';
import {GameGroupImpl} from '@/domain/Game/GameGroup';

export class Baseline extends GameGroupImpl {

  public id: string;
  public name: string;
  public brokerSets: BrokerSet[];
  public weatherConfigurations: WeatherConfigurationData[];
  public games: Game[];
  public createdAt: number;
  public commonParameters: {[key: string]: string};

  constructor(data: BaselineData) {
    super();
    this.id = data.id;
    this.name = data.name;
    this.brokerSets = data.brokerSets;
    this.weatherConfigurations = data.weatherConfigurations;
    this.games = data.games.map((gameData) => new Game(gameData));
    this.createdAt = data.createdAt;
    this.commonParameters = data.commonParameters;
  }

}
