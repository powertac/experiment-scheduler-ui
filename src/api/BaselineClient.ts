import axios, {AxiosError} from 'axios';
import config from '@/config';

export default class BaselineClient {

  public static export(id: string, target: string, hostUri: string): Promise<void> {
    return new Promise<void>((resolve: () => void,
                              reject: (error: AxiosError) => void) => {
      axios.post(config.services.orchestrator.uri + '/baselines/' + id + '/export', {target, hostUri})
        .then(() => resolve())
        .catch((error: AxiosError) => reject(error));
    });
  }

}
