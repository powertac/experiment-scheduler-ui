import Game from '@/domain/Game/Game';

export interface GameGroup {
  readonly games: Game[];
  readonly completedGames: Game[];
  readonly failedGames: Game[];
  readonly progress: number;
  readonly isRunning: boolean;
  readonly status: string;
}

export abstract class GameGroupImpl {

  abstract get games(): Game[];

  get completedGames(): Game[] {
    return this.games.filter((g) => g.status === 'completed');
  }

  get failedGames(): Game[] {
    return this.games.filter((g) => g.status === 'failed');
  }

  get progress(): number {
    if (this.games.length < 1) {
      return 0;
    }
    return this.completedGames.length / this.games.length;
  }

  get isRunning(): boolean {
    return this.games.filter((g) => g.status === 'running').length > 0;
  }

  get status(): string {
    if (this.progress === 1) {
      return 'completed';
    } else if (this.isRunning) {
      return 'running';
    } else if (this.failedGames.length > 0) {
      return 'failed';
    } else {
      return 'queued';
    }
  }

}
