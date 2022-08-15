import axios, {AxiosError, AxiosResponse} from 'axios';
import config from '@/config';
import {GameRun} from '@/domain/Game/GameRun';

export default class GameClient {

  public static gameBytes(id: string): Promise<number> {
    return new Promise<number>((resolve: (size: number) => void,
                                reject: (error: AxiosError) => void) => {
      axios.get(config.services.orchestrator.uri + '/storage/games/' + id)
        .then((response: AxiosResponse<number>) => resolve(response.data))
        .catch((error: AxiosError) => reject(error));
    });
  }

  public static failedRuns(): Promise<GameRun[]> {
    return new Promise<GameRun[]>((resolve: (size: GameRun[]) => void,
                                   reject: (error: AxiosError) => void) => {
      axios.get(config.services.orchestrator.uri + '/runs/failed')
        .then((response: AxiosResponse<GameRun[]>) => resolve(response.data))
        .catch((error: AxiosError) => reject(error));
    });
  }

  public static gameRunBytes(id: string): Promise<number> {
    return new Promise<number>((resolve: (size: number) => void,
                                reject: (error: AxiosError) => void) => {
      axios.get(config.services.orchestrator.uri + '/storage/runs/' + id)
        .then((response: AxiosResponse<number>) => resolve(response.data))
        .catch((error: AxiosError) => reject(error));
    });
  }

  public static removeRunFiles(runId: string): Promise<void> {
    return new Promise<void>((resolve: () => void, reject: (error: AxiosError) => void) => {
      axios.delete(config.services.orchestrator.uri + '/files/runs/' + runId)
        .then(() => resolve())
        .catch((error: AxiosError) => reject(error));
    });
  }

}
