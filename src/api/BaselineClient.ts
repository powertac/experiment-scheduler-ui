import axios, {AxiosError} from 'axios';
import config from '@/config';
import {BaselineData} from '@/domain/Baseline/BaselineData';
import {RestClient} from '@/api/RestClient';
import auth from '@/api/AuthProvider';
import {BaselineSpec} from '@/domain/Baseline/BaselineSpec';
import {BaselineConfig} from '@/domain/Baseline/BaselineConfig';

export default class BaselineClient extends RestClient {

  constructor() {
    super(auth.orchestrator);
  }

  public getAll(): Promise<BaselineData[]> {
    return new Promise<BaselineData[]>((resolve: (response: BaselineData[]) => void,
                                        reject: (error: AxiosError) => void) => {
      this.api.get(config.services.orchestrator.uri + '/baselines/')
        .then((response) => resolve(response.data))
        .catch((error: AxiosError) => reject(error));
    });
  }

  // TODO : deprecated
  public create(spec: BaselineSpec): Promise<void> {
    return new Promise<void>((resolve: (response: void) => void, reject: (error: AxiosError) => void) => {
      axios.post(config.services.orchestrator.uri + '/baselines/', spec)
        .then(() => resolve())
        .catch((error: AxiosError) => reject(error));
    });
  }

  public generate(baselineConfig: BaselineConfig): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.api.post(config.services.orchestrator.uri + '/baselines/generate', baselineConfig)
        .then(() => resolve())
        .catch((e) => reject(e));
    });
  }

  public export(id: string, target: string, hostUri: string): Promise<void> {
    return new Promise<void>((resolve: () => void,
                              reject: (error: AxiosError) => void) => {
      this.api.post(config.services.orchestrator.uri + '/baselines/' + id + '/export', {target, hostUri})
        .then(() => resolve())
        .catch((error: AxiosError) => reject(error));
    });
  }

}
