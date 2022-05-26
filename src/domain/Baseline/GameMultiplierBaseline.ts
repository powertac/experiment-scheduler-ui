import {GameSpec} from '@/domain/Game/GameSpec';
import {BaselineGenerator} from '@/domain/Baseline/BaselineConfig';

export class GameMultiplierBaselineGenerator implements BaselineGenerator {

  private games: GameSpec[];
  private multiplier: number;

  constructor(games: GameSpec[], multiplier: number) {
    this.games = games;
    this.multiplier = multiplier;
  }

  get type(): string {
    return 'game-multiplier';
  }

  get isValid(): boolean {
    return Number.isInteger(this.multiplier)
      && this.multiplier > 1
      && this.games.length > 0;
  }

}
