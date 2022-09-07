import axios, {AxiosInstance} from 'axios';
import TokenStorage from '../domain/Security/TokenStorage';
import config from '../config';

export class AuthProvider {

  private _baseUrl: string;
  private axios: AxiosInstance|null;

  constructor(baseUrl: string) {
    this._baseUrl = baseUrl;
  }

  get api(): AxiosInstance {
    if (null === this.axios) {
      this.axios = this.default;
    }
    return this.axios;
  }

  set baseUrl(url: string) {
    this._baseUrl = url;
    this.axios = this.default;
  }

  public authenticate(token: string) {
    this.axios = this.createAuthenticatedClient(token);
  }

  public validateAuth(): void {
    this.api.get('/auth/').catch(() => this.revokeAuth());
  }

  public revokeAuth(): void {
    this.axios = this.createPublicClient();
  }

  private get default(): AxiosInstance {
    const token = TokenStorage.loadToken();
    return null === token
      ? this.createPublicClient()
      : this.createAuthenticatedClient(token);
  }

  private createPublicClient(): AxiosInstance {
    return axios.create({baseURL: this.baseUrl});
  }

  private createAuthenticatedClient(token: string): AxiosInstance {
    return axios.create({
      baseURL: this.baseUrl,
      headers: {Authorization: token},
    });
  }

}

const auth = {
  orchestrator: new AuthProvider(config.services.orchestrator.uri),
};
config.load().then(() => auth.orchestrator.baseUrl = config.services.orchestrator.uri);
export default auth;
