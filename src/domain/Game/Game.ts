import {GameInterface} from '@/domain/Game/GameInterface';
import {Broker} from '@/domain/Broker/Broker';
import {GameRun} from '@/domain/Game/GameRun';
import {WeatherConfigurationData} from '@/domain/Weather/WeatherConfigurationData';

export default class Game implements GameInterface {
  public id: string;
  public bootstrap: File;
  public name: string;
  public runs: GameRun[];
  public seed: File;
  public serverParameters: {[key: string]: string};
  public createdAt: number;
  public files: { [role: string]: string };
  public cancelled: boolean;
  public weather: WeatherConfigurationData;
  public baseline: string;
  private _brokers: Broker[];

  constructor(id: string, bootstrap: File, brokers: Broker[], name: string, runs: GameRun[], seed: File,
              serverParameters: {[key: string]: string}, createdAt: number, files: { [role: string]: string },
              cancelled: boolean, weather: WeatherConfigurationData, baseline: string) {
    this.id = id;
    this.bootstrap = bootstrap;
    this.brokers = brokers;
    this.name = name;
    this.runs = runs;
    this.seed = seed;
    this.serverParameters = serverParameters;
    this.createdAt = createdAt;
    this.files = files;
    this.cancelled = cancelled;
    this.weather = weather;
    this.baseline = baseline;
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
    } else if (this.runs.length < 5) {
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
    for (const key in this.files) {
      hasStateLog = hasStateLog || (key === 'STATE_LOG');
      hasBootstrapFile = hasBootstrapFile || (key === 'BOOTSTRAP');
    }
    return hasStateLog && hasBootstrapFile;
  }

}
