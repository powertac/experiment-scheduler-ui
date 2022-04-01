import {Broker} from '@/domain/Broker/Broker';
import {GameRun} from '@/domain/Game/GameRun';
import {WeatherConfigurationData} from '@/domain/Weather/WeatherConfigurationData';
import {GameData} from '@/domain/Game/GameData';

export default class Game {

  public id: string;
  public bootstrap: File;
  public name: string;
  public runs: GameRun[];
  public seed: File;
  public serverParameters: {[key: string]: string};
  public createdAt: number;
  public cancelled: boolean;
  public weather: WeatherConfigurationData;
  public baseline: string|null;
  private _brokers: Broker[];
  private base: string|null;
  private treatment: string|null;

  constructor(data: GameData) {
    this.id = data.id;
    this.bootstrap = data.bootstrap;
    this.brokers = data.brokers;
    this.name = data.name;
    this.runs = data.runs;
    this.seed = data.seed;
    this.serverParameters = data.serverParameters;
    this.createdAt = data.createdAt;
    this.cancelled = data.cancelled;
    this.weather = data.weather;
    this.baseline = data.baseline;
    this.base = data.base;
    this.treatment = data.treatment;
  }

  set brokers(brokers) {
    this._brokers = brokers;
  }

  get brokers(): Broker[] {
    return this._brokers.slice().sort((a, b) => (a.name === b.name) ? 0 : (a.name >= b.name) ? 1 : -1);
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

  get isValidTemplate(): boolean {
    if ('completed' !== this.status) {
      return false;
    }
    let hasStateLog = false;
    let hasBootstrapFile = false;
    for (const key in this.files) { // FIXME : check orchestrator for this information
      hasStateLog = hasStateLog || (key === 'STATE_LOG');
      hasBootstrapFile = hasBootstrapFile || (key === 'BOOTSTRAP');
    }
    return hasStateLog && hasBootstrapFile;
  }

}
