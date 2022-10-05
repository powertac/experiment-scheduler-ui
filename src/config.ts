import axios, {AxiosError, AxiosResponse} from 'axios';

interface ServiceUriConfig {
    orchestrator: string;
    weather: string;
}

interface Service {
    uri: string;
}

interface Services {
    orchestrator: Service;
    weather: Service;
}

class ConfigurationProvider {

    public services: Services;
    public mode: string;
    public localStorageKey: string;

    constructor() {
        this.services = {
            orchestrator: {uri: ''},
            weather: {uri: ''},
        };
        this.localStorageKey = '8hK8l03BbLtFo6Ox18lKL1dzTt3aNYx0';
    }

    public load(): Promise<void> {
        return new Promise<void>((resolve: () => void, reject: (error: Error) => void) => {
            this.mode = undefined !== process.env.NODE_ENV ? process.env.NODE_ENV : '';
            if (process.env.NODE_ENV === 'development') {
                if (undefined !== process.env.VUE_APP_ORCHESTRATOR_URI) {
                    this.services.orchestrator = {uri: process.env.VUE_APP_ORCHESTRATOR_URI};
                }
                if (undefined !== process.env.VUE_APP_WEATHER_SERVER_URI) {
                    this.services.weather = {uri: process.env.VUE_APP_WEATHER_SERVER_URI};
                }
                resolve();
                return;
            }
            if (process.env.NODE_ENV === 'production') {
                axios.get('http://' + window.location.host + '/discovery.json')
                    .then((response: AxiosResponse<ServiceUriConfig>) => {
                        this.services.orchestrator = {uri: response.data.orchestrator};
                        this.services.weather = {uri: response.data.weather};
                        resolve();
                    })
                    .catch((errorResponse: AxiosError) => reject(errorResponse));
                return;
            }
            reject(new Error('ConfigurationProvider could not be initialized.'));
        });
    }

}

const config = new ConfigurationProvider();
export default config;
