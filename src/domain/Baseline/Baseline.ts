import {Game} from '@/domain/Game/Game';

export interface Baseline {
  id: string;
  name: string;
  games: Game[];
}
