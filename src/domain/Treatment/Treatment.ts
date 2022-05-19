import {Modifier, ModifierData, ModifierSpec} from '@/domain/Treatment/Modifier';
import {Baseline} from '@/domain/Baseline/Baseline';
import store from '@/domain/Store/RootStoreImpl';
import {findOrFail} from '@/domain/FindOrFail';
import Game from '@/domain/Game/Game';
import {GameGroupImpl} from '@/domain/Game/GameGroup';

export interface TreatmentSpec<T extends ModifierSpec> {
  name?: string;
  baselineId?: string;
  modifier?: T;
}

export class Treatment<T extends Modifier> extends GameGroupImpl implements TreatmentSpec<T> {

  public id: string;
  public name: string;
  public baselineId: string;
  public modifier: T;
  public gameIds: string[];
  private _baseline: Baseline|null;

  constructor(data: TreatmentData) {
    super();
    this.id = data.id;
    this.name = data.name;
    this.baselineId = data.baselineId;
    this.modifier = data.modifier as T;
    this.gameIds = data.gameIds;
    this._baseline = null;
  }

  get baseline(): Baseline {
    return this._baseline = (this._baseline === null)
      ? findOrFail<Baseline>(() => store.getters['baselines/find'](this.baselineId))
      : this._baseline;
  }

  get games(): Game[] {
    return findOrFail<Game[]>(() => store.getters['games/findSome'](this.gameIds));
  }

}

export interface TreatmentData {
  id: string;
  name: string;
  modifier: ModifierData;
  baselineId: string;
  gameIds: string[];
}
