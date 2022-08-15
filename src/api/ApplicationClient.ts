import axios, {AxiosError, AxiosResponse} from 'axios';
import config from '@/config';

export default class ApplicationClient {

  public static hostExportBasePath(): Promise<string> {
    return new Promise<string>((resolve: (path: string) => void,
                                reject: (error: AxiosError) => void) => {
      axios.get(config.services.orchestrator.uri + '/paths/export')
        .then((response: AxiosResponse<string>) => resolve(response.data))
        .catch((error: AxiosError) => reject(error));
    });
  }

}
