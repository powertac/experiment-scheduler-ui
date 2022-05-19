import {Broker} from '@/domain/Broker/Broker';
import {GameRun} from '@/domain/Game/GameRun';
import {WeatherConfigurationData} from '@/domain/Weather/WeatherConfigurationData';
import {GameData} from '@/domain/Game/GameData';
import {Treatment} from '@/domain/Treatment/Treatment';
import {findOrFail} from '@/domain/FindOrFail';
import store from '@/domain/Store/RootStoreImpl';
import {Baseline} from '@/domain/Baseline/Baseline';

export default class Game {

  public readonly id: string;
  public readonly bootstrap: File;
  public readonly name: string;
  public readonly runs: GameRun[];
  public readonly seed: File;
  public readonly serverParameters: {[key: string]: string};
  public readonly createdAt: number;
  public readonly cancelled: boolean;
  public readonly weather: WeatherConfigurationData;
  public readonly isValidTemplate: boolean;
  public readonly baselineId: string|null;
  private readonly baseId: string|null;
  private readonly treatmentId: string|null;
  private readonly _brokers: Broker[];

  constructor(data: GameData) {
    this.id = data.id;
    this.bootstrap = data.bootstrap;
    this._brokers = data.brokers;
    this.name = data.name;
    this.runs = data.runs;
    this.seed = data.seed;
    this.serverParameters = data.serverParameters;
    this.createdAt = data.createdAt;
    this.cancelled = data.cancelled;
    this.weather = data.weather;
    this.baselineId = data.baselineId !== undefined ? data.baselineId : null;
    this.baseId = data.baseId !== undefined ? data.baseId : null;
    this.treatmentId = data.treatmentId !== undefined ? data.treatmentId : null;
    this.isValidTemplate = data.isValidTemplate;
  }

  get baseline(): Baseline|null {
    return this.baselineId !== null
      ? findOrFail<Baseline>(() => store.getters['baselines/find'](this.baselineId))
      : null;
  }

  get base(): Game|null {
    return this.baseId !== null
      ? findOrFail<Game>(() => store.getters['games/find'](this.baseId))
      : null;
  }

  get treatment(): Treatment<any>|null {
    return this.treatmentId !== null
      ? findOrFail<Treatment<any>>(() => store.getters['treatments/find'](this.treatmentId))
      : null;
  }

  get brokers(): Broker[] {
    return this._brokers.slice()
      .sort((a, b) => (a.name === b.name) ? 0 : (a.name >= b.name) ? 1 : -1);
  }

  get status(): string {
    if (this.cancelled) {
      return 'cancelled';
    } else if (this.completedRun !== undefined) {
      return 'completed';
    } else if (this.activeRun !== undefined) {
      return 'running';
    } else if (this.runs.length < 3) {
      return 'queued';
    }
    return 'failed';
  }

  get statusIndex(): number {
    switch (this.status) {
      case 'running': { return 0; }
      case 'queued': { return 1; }
      case 'completed': { return 2; }
      case 'failed': { return 3; }
      case 'cancelled': { return 4; }
      default: { return -1; }
    }
  }

  get activeRun(): GameRun|undefined {
    return this.runs
      .filter((r) => r.phase !== 'DONE' && r.phase !== 'NONE')
      .pop();
  }

  get completedRun(): GameRun|undefined {
    return this.runs
      .filter((r) => !r.failed && r.phase === 'DONE')
      .pop();
  }

  get start(): number {
    if (this.completedRun !== undefined) {
      return this.completedRun.start;
    } else if (this.activeRun !== undefined) {
      return this.activeRun.start;
    } else {
      return -1;
    }
  }

  get end(): number {
    let end: number|null = null;
    if (this.completedRun !== undefined) {
      end = this.completedRun.end;
    } else if (this.activeRun !== undefined) {
      end = this.activeRun.end;
    }
    return end !== null ? end : -1;
  }

}
