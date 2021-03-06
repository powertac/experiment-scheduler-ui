import axios, {AxiosError, AxiosResponse} from 'axios';

interface ServiceUriConfig {
    orchestrator: string;
}

interface Service {
    uri: string;
}

class ConfigurationProvider {

    public services: {[key: string]: Service};
    public mode: string;

    constructor() {
        this.services = {};
    }

    public load(): Promise<void> {
        return new Promise<void>((resolve: () => void, reject: (error: Error) => void) => {

            this.mode = undefined !== process.env.NODE_ENV ? process.env.NODE_ENV : '';

            if (process.env.NODE_ENV === 'development' && undefined !== process.env.VUE_APP_ORCHESTRATOR_URI) {
                this.services.orchestrator = {uri: process.env.VUE_APP_ORCHESTRATOR_URI};
                resolve();
                return;
            }

            if (process.env.NODE_ENV === 'production') {
                axios.get('http://' + window.location.host + '/discovery.json')
                    .then((response: AxiosResponse<ServiceUriConfig>) => {
                        this.services.orchestrator = {uri: response.data.orchestrator};
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
