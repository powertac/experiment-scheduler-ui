import {AxiosError, AxiosResponse} from 'axios';
import config from '@/config';
import FileNode from '@/domain/File/FileNode';
import {RestClient} from '@/api/RestClient';
import auth from '@/api/AuthProvider';
import {ServerStatus} from '@/domain/Service/ServerStatus';

interface RestResponse {
  success: boolean;
  message: string;
  payload: any;
}

export default class ApplicationClient extends RestClient {

  constructor() {
    super(auth.orchestrator);
  }

  public hostExportBasePath(): Promise<string> {
    return new Promise<string>((resolve: (path: string) => void,
                                reject: (error: AxiosError) => void) => {
      this.api.get(config.services.orchestrator.uri + '/paths/export')
        .then((response: AxiosResponse<string>) => resolve(response.data))
        .catch((error: AxiosError) => reject(error));
    });
  }

  public fileContents(file: FileNode): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.api.get(config.services.orchestrator.uri + '/files', {params: {path: file.path, offset: 0, length: 9999}})
        .then((response) => resolve(response.data))
        .catch((error) => reject(error));
    });
  }

  public supportedParams(): Promise<string[]> {
    return new Promise<string[]>((resolve: (params: string[]) => void,
                                  reject: (error: AxiosError) => void) => {
      this.api.get(config.services.orchestrator.uri + '/game-parameters/')
        .then((response: AxiosResponse<string[]>) => resolve(response.data))
        .catch((response: AxiosError) => reject(response));
    });
  }

  public serverStatus(): Promise<ServerStatus> {
    return new Promise<ServerStatus>((resolve: (params: ServerStatus) => void,
                                      reject: (error: AxiosError) => void) => {
      this.api.get(config.services.orchestrator.uri + '/status', {timeout: 2500})
        // TODO : replace RestRepsonse
        .then((response: AxiosResponse<RestResponse>) => resolve(response.data.payload))
        .catch((response: AxiosError) => reject(response));
    });
  }

  public images(): Promise<Image[]> {
    return new Promise<Image[]>((resolve: (response: Image[]) => void, reject: (error: AxiosError) => void) => {
      this.api.get(config.services.orchestrator.uri + '/docker/images/')
        .then((response: AxiosResponse<Image[]>) => resolve(response.data))
        .catch((error: AxiosError) => reject(error));
    });
  }

}
