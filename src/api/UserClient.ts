import {RestClient} from "@/api/RestClient";
import auth from "@/api/AuthProvider";
import {AxiosError} from "axios";
import config from "@/config";
import {UserData} from "@/domain/User/User";

export default class UserClient extends RestClient {

    constructor() {
        super(auth.orchestrator);
    }

    public getAll(): Promise<UserData[]> {
        return new Promise<UserData[]>((resolve: (response: UserData[]) => void,
                                            reject: (error: AxiosError) => void) => {
            this.api.get(config.services.orchestrator.uri + '/users/')
                .then((response) => resolve(response.data))
                .catch((error: AxiosError) => reject(error));
        });
    }

}