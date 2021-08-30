import {Game, GameRun} from '@/domain/Game/GameTypes';
import {BrokerSpec} from '@/domain/Broker/BrokerSpec';

export default class GameImpl implements Game {
  public id: string;
  public bootstrap: File;
  public name: string;
  public runs: GameRun[];
  public seed: File;
  public serverParameters: {[key: string]: string};
  public createdAt: number;
  public files: { [role: string]: string };
  private _brokers: BrokerSpec[];

  constructor(id: string, bootstrap: File, brokers: BrokerSpec[], name: string, runs: GameRun[], seed: File,
              serverParameters: {[key: string]: string}, createdAt: number, files: { [role: string]: string }) {
    this.id = id;
    this.bootstrap = bootstrap;
    this.brokers = brokers;
    this.name = name;
    this.runs = runs;
    this.seed = seed;
    this.serverParameters = serverParameters;
    this.createdAt = createdAt;
    this.files = files;
  }

  set brokers(brokers) {
    this._brokers = brokers;
  }

  get brokers(): BrokerSpec[] {
    return this._brokers.slice().sort((a, b) => (a.name === b.name) ? 0 : (a.name >= b.name) ? 1 : -1);
  }

  get status(): string {
    if (this.completedRun !== undefined) {
      return 'completed';
    }
    if (this.runs.length < 5) {
      return this.activeRun !== undefined ? 'running' : 'queued';
    }
    return 'failed';
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
    if (this.completedRun !== undefined) {
      return this.completedRun.end;
    } else if (this.activeRun !== undefined) {
      return this.activeRun.end;
    } else {
      return -1;
    }
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
