import {Modifier, ModifierSpec} from '@/domain/Treatment/ModifierSpec';
import {Baseline} from '@/domain/Baseline/Baseline';
import Game from '@/domain/Game/Game';

export interface TreatmentSpec<T extends ModifierSpec> {
  name?: string;
  baselineId?: string;
  modifier?: T;
}

export class Treatment<T extends Modifier> implements TreatmentSpec<T> {

  public id: string;
  public name: string;
  public baseline: Baseline;
  public modifier: T;
  public games: Game[];

  constructor(id: string, name: string, baseline: Baseline, modifier: T, games: Game[]) {
    this.id = id;
    this.name = name;
    this.baseline = baseline;
    this.modifier = modifier;
    this.games = games;
  }

  get baselineId(): string {
    return this.baseline.id;
  }

}
