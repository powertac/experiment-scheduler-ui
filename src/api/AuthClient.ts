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
    return new Promise<void>((resolve: () => void, reject: (error: AxiosError) => void) => {
      this.api.post(config.services.orchestrator.uri + '/auth/', credentials)
        .then((response: AxiosResponse<string>) => {
          this.authProvider.authenticate(response.data);
          resolve();
        }).catch((error: AxiosError) => this.handleError(error, reject));
    });
  }

  public verify(): Promise<boolean> {
      return new Promise<boolean>((resolve: (authenticated: boolean) => void, reject: (error: AxiosError) => void) => {
          this.api.get(config.services.orchestrator.uri + '/auth/')
              .then((response: AxiosResponse<boolean>) => resolve(response.data))
              .catch((error: AxiosError) => this.handleError(error, reject));
      });
  }

  public logout(): Promise<void> {
    return new Promise<void>((resolve: () => void, reject: (error: AxiosError|void) => void) => {
        this.authProvider.revokeAuth();
        this.api.delete(config.services.orchestrator.uri + '/auth/')
            .then(() => resolve())
            .catch((error: AxiosError) => reject(error));
    });
  }

}

export const orchestratorAuthClient = new AuthClient(auth.orchestrator);
