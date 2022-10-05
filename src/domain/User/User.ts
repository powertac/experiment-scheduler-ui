export class User implements UserData {

    id: string;
    username: string;
    roles: string[];
    enabled: boolean;

    constructor(props: UserData) {
        this.id = props.id;
        this.username = props.username;
        this.roles = props.roles;
        this.enabled = props.enabled;
    }

    get isAdmin(): boolean {
        return this.hasRole("ADMIN");
    }

    public hasRole(role: string): boolean {
        return this.roles.filter(r => r.toUpperCase() === role.toUpperCase()).length === 1;
    }

}

export interface UserData {
    id: string;
    username: string;
    roles: string[];
    enabled: boolean;
}

export interface UserSpec {
    username: string;
    roleNames: string[];
    enabled: boolean;
}

export interface CreateUserRequest extends UserSpec {
    token: string;
}