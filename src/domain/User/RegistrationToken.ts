import {User} from "@/domain/User/User";
import {findOrFail} from "@/domain/FindOrFail";
import store from "@/domain/Store/RootStoreImpl";
import moment, {Moment} from "moment";

export class RegistrationToken {

    public id: number;
    public token: string;

    private readonly issuedById: string;
    private readonly claimedById: string|null;
    private readonly expirationNumber: number;
    private readonly issuedAtNumber: number;
    private readonly claimedAtNumber: number|null;

    constructor(data: RegistrationTokenData) {
        this.id = data.id;
        this.token = data.token;
        this.expirationNumber = data.expirationDate;
        this.issuedById = data.issuedBy;
        this.issuedAtNumber = data.issuedAt;
        this.claimedById = data.claimedBy;
        this.claimedAtNumber = data.claimedAt;
    }

    get issuedBy(): User {
        return findOrFail<User>(() => store.getters['users/find'](this.issuedById));
    }

    get claimedBy(): User|null {
        return store.getters['users/find'](this.claimedById);
    }

    get expirationDate(): Moment {
        return moment(this.expirationNumber);
    }

    get issuedAt(): Moment {
        return moment(this.issuedAtNumber);
    }

    get claimedAt(): Moment|null {
        return this.claimedAtNumber !== null
            ? moment(this.claimedAtNumber)
            : null;
    }

}

export interface RegistrationTokenData {

    id: number;
    token: string;
    expirationDate: number;
    issuedBy: string;
    issuedAt: number;
    claimedBy: string|null;
    claimedAt: number|null;

}