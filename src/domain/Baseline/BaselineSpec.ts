import {Game} from '@/domain/Game/Game';

export interface BaselineSpec {
  name: string;
  instances: Game[];
}
