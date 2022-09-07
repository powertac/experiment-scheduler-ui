import {AxiosError, AxiosResponse} from 'axios';
import config from '@/config';
import {GameRun} from '@/domain/Game/GameRun';
import auth from '@/api/AuthProvider';
import {GameData} from '@/domain/Game/GameData';
import {RestClient} from '@/api/RestClient';
import {GameSpec} from '@/domain/Game/GameSpec';
import Game from '@/domain/Game/Game';

export default class GameClient extends RestClient {

  constructor() {
    super(auth.orchestrator);
  }

  public get(id: string): Promise<GameData> {
    return new Promise<GameData>((resolve: (games: GameData) => void, reject: (error: AxiosError) => void) => {
      this.api.get(config.services.orchestrator.uri + '/games/' + id)
        .then((response: AxiosResponse<GameData>) => resolve(response.data))
        .catch((error: AxiosError) => reject(error));
    });
  }

  public getAll(): Promise<GameData[]> {
    return new Promise<GameData[]>((resolve: (games: GameData[]) => void, reject: (error: AxiosError) => void) => {
      this.api.get(config.services.orchestrator.uri + '/games/')
        .then((response: AxiosResponse<GameData[]>) => resolve(response.data))
        .catch((error: AxiosError) => reject(error));
    });
  }

  public page(start: number, limit: number): Promise<GameData[]> {
    return new Promise<GameData[]>((resolve: (games: GameData[]) => void, reject: (error: AxiosError) => void) => {
      this.api.get(config.services.orchestrator.uri + '/games/?start=' + start + '&limit=' + limit)
        .then((response: AxiosResponse<GameData[]>) => resolve(response.data))
        .catch((error: AxiosError) => reject(error));
    });
  }

  public count(): Promise<number> {
    return new Promise<number>((resolve: (count: number) => void, reject: (error: AxiosError) => void) => {
      this.api.get(config.services.orchestrator.uri + '/games/count')
        .then((response: AxiosResponse<number>) => resolve(response.data))
        .catch((error: AxiosError) => reject(error));
    });
  }

  public create(spec: GameSpec): Promise<void> {
    return new Promise<void>((resolve: (response: void) => void, reject: (error: AxiosError) => void) => {
      this.api.post(config.services.orchestrator.uri + '/games/', spec)
        .then(() => resolve())
        .catch((error: AxiosError) => reject(error));
    });
  }

  public rerun(game: Game): Promise<void> {
    return new Promise<void>((resolve: (response: void) => void, reject: (error: AxiosError) => void) => {
      this.api.post(config.services.orchestrator.uri + '/games/' + game.id + '/rerun')
        .then(() => resolve())
        .catch((error: AxiosError) => reject(error));
    });
  }

  public delete(game: Game): Promise<void> {
    return new Promise<void>((resolve: (response: void) => void, reject: (error: AxiosError) => void) => {
      this.api.delete(config.services.orchestrator.uri + '/games/' + game.id)
        .then(() => resolve())
        .catch((error: AxiosError) => reject(error));
    });
  }

  public storageBytes(id: string): Promise<number> {
    return new Promise<number>((resolve: (size: number) => void,
                                reject: (error: AxiosError) => void) => {
      this.api.get(config.services.orchestrator.uri + '/storage/games/' + id)
        .then((response: AxiosResponse<number>) => resolve(response.data))
        .catch((error: AxiosError) => reject(error));
    });
  }

  public failed(): Promise<GameRun[]> {
    return new Promise<GameRun[]>((resolve: (size: GameRun[]) => void,
                                   reject: (error: AxiosError) => void) => {
      this.api.get(config.services.orchestrator.uri + '/runs/failed')
        .then((response: AxiosResponse<GameRun[]>) => resolve(response.data))
        .catch((error: AxiosError) => reject(error));
    });
  }

}
