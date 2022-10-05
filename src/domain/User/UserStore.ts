import {User, UserData} from "@/domain/User/User";
import {ActionContext, ActionTree, GetterTree, Module, MutationTree} from "vuex";
import {RootStoreState} from "@/domain/Store/RootStore";
import {RegistrationToken, RegistrationTokenData} from "@/domain/User/RegistrationToken";

export interface UserStoreState {
    current: User|null;
    users: { [key: string]: User }
    registrations: { [key: number]: RegistrationToken };
}

export interface UserStoreGetters extends GetterTree<UserStoreState, RootStoreState> {
    current: (state: UserStoreState) => User|null;
    find: (state: UserStoreState) => (id: string) => User|null;
    findAll: (state: UserStoreState) => User[];
    findRegistrations: (state: UserStoreState) => RegistrationToken[];
}

export interface UserStoreMutations extends MutationTree<UserStoreState> {
    setCurrent: (state: UserStoreState, user: UserData) => void;
    add: (state: UserStoreState, user: UserData) => void;
    addRegistration: (state: UserStoreState, token: RegistrationTokenData) => void;
}

export interface UserStoreActions extends ActionTree<UserStoreState, RootStoreState> {
    loadCurrent: (context: ActionContext<UserStoreState, RootStoreState>) => void;
    loadAll: (context: ActionContext<UserStoreState, RootStoreState>) => void;
    loadRegistrations: (context: ActionContext<UserStoreState, RootStoreState>) => void;
}

export interface UserStore extends Module<UserStoreState, RootStoreState> {
    namespaced: boolean;
    state: UserStoreState;
    getters: UserStoreGetters;
    mutations: UserStoreMutations;
    actions: UserStoreActions;
}