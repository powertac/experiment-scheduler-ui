import {RestClient} from '@/api/RestClient';
import auth, {AuthProvider} from '@/api/AuthProvider';
import Credentials from '@/domain/Security/Credentials';
import {AxiosError, AxiosResponse} from 'axios';
import config from '@/config';

export default class AuthClient extends RestClient {

  constructor(authProvider: AuthProvider) {
    super(authProvider);
  }

  public login(credentials: Credentials): Promise<void> {
    console.log(this.api);
    return new Promise<void>((resolve: () => void, reject: (error: AxiosError) => void) => {
      this.api.post(config.services.orchestrator.uri + '/auth/', credentials)
        .then((response: AxiosResponse<string>) => {
          this.authProvider.authenticate(response.data);
          resolve();
        }).catch((error: AxiosError) => this.handleError(error, reject));
    });
  }

  public logout(): Promise<void> {
    return new Promise<void>((resolve: () => void, reject: (error: AxiosError|void) => void) => {
        this.api.delete(config.services.orchestrator.uri + '/auth/')
          .then(() => {
            this.authProvider.revokeAuth();
            resolve();
          }).catch((error: AxiosError) => reject(error));
    });
  }

}

export const orchestratorAuthClient = new AuthClient(auth.orchestrator);
