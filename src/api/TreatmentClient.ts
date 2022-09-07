import {RestClient} from '@/api/RestClient';
import auth from '@/api/AuthProvider';
import {TreatmentData, TreatmentSpec} from '@/domain/Treatment/Treatment';
import config from '@/config';

export default class TreatmentClient extends RestClient {

  constructor() {
    super(auth.orchestrator);
  }

  public getAll(): Promise<TreatmentData[]> {
    return new Promise<TreatmentData[]>((resolve, reject) => {
      this.api.get(config.services.orchestrator.uri + '/treatments/')
        .then((response) => resolve(response.data))
        .catch((error) => reject(error));
    });
  }

  public create(spec: TreatmentSpec<any>): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.api.post(config.services.orchestrator.uri + '/treatments/', spec)
        .then((response) => resolve(response.data))
        .catch((error) => reject(error));
    });
  }

}
