import {BaselineGenerator} from '@/domain/Baseline/BaselineConfig';
import {GameConfig} from '@/domain/Game/GameConfig';

export class GameMultiplierBaselineGenerator implements BaselineGenerator {

  public readonly type: string = 'game-multiplier';
  private games: GameConfig[];
  private multiplier: number;

  constructor(games: GameConfig[], multiplier: number) {
    this.games = games;
    this.multiplier = multiplier;
  }

  get isValid(): boolean {
    return this.multiplier > 1
      && this.games.length > 0;
  }

}
