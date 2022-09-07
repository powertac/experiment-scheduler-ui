import {AxiosError, AxiosResponse} from 'axios';
import config from '@/config';
import auth from '@/api/AuthProvider';
import {RestClient} from '@/api/RestClient';
import FileNode from '@/domain/File/FileNode';

export default class GameRunClient extends RestClient {

  constructor() {
    super(auth.orchestrator);
  }

  public storageBytes(id: string): Promise<number> {
    return new Promise<number>((resolve: (size: number) => void,
                                reject: (error: AxiosError) => void) => {
      this.api.get(config.services.orchestrator.uri + '/storage/runs/' + id)
        .then((response: AxiosResponse<number>) => resolve(response.data))
        .catch((error: AxiosError) => reject(error));
    });
  }

  public removeFiles(runId: string): Promise<void> {
    return new Promise<void>((resolve: () => void, reject: (error: AxiosError) => void) => {
      this.api.delete(config.services.orchestrator.uri + '/files/runs/' + runId)
        .then(() => resolve())
        .catch((error: AxiosError) => reject(error));
    });
  }

  public files(runId: string): Promise<FileNode> {
    return new Promise<FileNode>((resolve, reject) => {
      this.api.get(config.services.orchestrator.uri + '/files/run/' + runId)
        .then((response) => resolve(response.data))
        .catch((error) => reject(error));
    });
  }

}
