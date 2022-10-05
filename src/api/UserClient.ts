import {RestClient} from "@/api/RestClient";
import auth from "@/api/AuthProvider";
import {AxiosError, AxiosResponse} from "axios";
import config from "@/config";
import {UserData} from "@/domain/User/User";
import {RegistrationTokenData} from "@/domain/User/RegistrationToken";

export default class UserClient extends RestClient {

    constructor() {
        super(auth.orchestrator);
    }

    public getCurrent(): Promise<UserData> {
        return new Promise<UserData>((resolve: (response: UserData) => void,
                                        reject: (error: AxiosError) => void) => {
            this.api.get(config.services.orchestrator.uri + '/users/current')
                .then((response: AxiosResponse) => resolve(response.data))
                .catch((error: AxiosError) => reject(error));
        });
    }

    public getAll(): Promise<UserData[]> {
        return new Promise<UserData[]>((resolve: (response: UserData[]) => void,
                                            reject: (error: AxiosError) => void) => {
            this.api.get(config.services.orchestrator.uri + '/users/')
                .then((response) => resolve(response.data))
                .catch((error: AxiosError) => reject(error));
        });
    }

    public createRegistrationToken(): Promise<RegistrationTokenData> {
        return new Promise<RegistrationTokenData>((resolve: (response: RegistrationTokenData) => void,
                                    reject: (error: AxiosError) => void) => {
            this.api.post(config.services.orchestrator.uri + '/registrations/')
                .then((response: AxiosResponse) => resolve(response.data))
                .catch((error: AxiosError) => reject(error));
        });
    }

    public getRegistrations(): Promise<RegistrationTokenData[]> {
        return new Promise<RegistrationTokenData[]>((resolve: (response: RegistrationTokenData[]) => void,
                                    reject: (error: AxiosError) => void) => {
            this.api.get(config.services.orchestrator.uri + '/registrations/')
                .then((response: AxiosResponse) => resolve(response.data))
                .catch((error: AxiosError) => reject(error));
        });
    }

    public verifyRegistrationToken(token: string): Promise<void> {
        return new Promise<void>((resolve: () => void, reject: (error: AxiosError) => void) => {
            this.api.get(config.services.orchestrator.uri + '/registrations/' + token)
                .then(() => resolve())
                .catch((error: AxiosError) => reject(error));
        });
    }

}