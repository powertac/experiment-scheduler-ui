import {BaselineData} from '@/domain/Baseline/BaselineData';
import {Baseline} from '@/domain/Baseline/Baseline';
import {create} from '@/domain/Game/GameFactory';
import {GameInterface} from '@/domain/Game/GameInterface';

export default class BaselineFactory {

  public static create(data: BaselineData): Baseline {
    const games: GameInterface[] = [];
    for (const game of data.games) {
      games.push(create(game));
    }
    return new Baseline(data);
  }

}
