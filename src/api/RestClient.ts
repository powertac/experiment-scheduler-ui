import {AuthProvider} from '@/api/AuthProvider';
import {AxiosError, AxiosInstance, AxiosResponse} from 'axios';

export abstract class RestClient {

  protected readonly authProvider: AuthProvider;

  protected constructor(authProvider: AuthProvider) {
    this.authProvider = authProvider;
  }

  get api(): AxiosInstance {
    return this.authProvider.api;
  }

  protected handleError(error: AxiosError, reject: (error: AxiosError) => void): void {
    if (error.response !== undefined && error.response.status === 401) {
      this.authProvider.revokeAuth();
    }
    reject(error);
  }

}
