import {GameInterface} from '@/domain/Game/GameInterface';
import {GameData} from '@/domain/Game/GameData';
import Game from '@/domain/Game/Game';

export function create(data: GameData): GameInterface {
  return new Game(
    data.id,
    data.bootstrap,
    data.brokers,
    data.name,
    data.runs,
    data.seed,
    data.serverParameters,
    data.createdAt,
    data.files,
    data.cancelled,
    data.weather,
    data.baseline);
}
