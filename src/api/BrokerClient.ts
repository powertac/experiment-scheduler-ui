import auth from '@/api/AuthProvider';
import {RestClient} from '@/api/RestClient';
import {Broker} from '@/domain/Broker/Broker';
import {AxiosError, AxiosResponse} from 'axios';
import config from '@/config';

export default class BrokerClient extends RestClient {

  constructor() {
    super(auth.orchestrator);
  }

  public getAll(): Promise<Broker[]> {
    return new Promise<Broker[]>((resolve: (response: Broker[]) => void, reject: (error: AxiosError) => void) => {
      this.api.get(config.services.orchestrator.uri + '/brokers/')
        .then((response: AxiosResponse<Broker[]>) => resolve(response.data))
        .catch((error: AxiosError) => reject(error));
    });
  }

  public create(broker: Broker): Promise<void> {
    return new Promise<void>((resolve: (response: void) => void, reject: (error: AxiosError) => void) => {
      this.api.post(config.services.orchestrator.uri + '/brokers/', broker)
        .then(() => resolve())
        .catch((error: AxiosError) => reject(error));
    });
  }

}
