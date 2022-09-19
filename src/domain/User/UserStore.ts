import {User, UserData} from "@/domain/User/User";
import {ActionContext, ActionTree, GetterTree, Module, MutationTree} from "vuex";
import {RootStoreState} from "@/domain/Store/RootStore";

export interface UserStoreState {
    users: { [key: string]: User }
}

export interface UserStoreGetters extends GetterTree<UserStoreState, RootStoreState> {
    find: (state: UserStoreState) => (id: string) => User|null;
    findAll: (state: UserStoreState) => User[];
}

export interface UserStoreMutations extends MutationTree<UserStoreState> {
    add: (state: UserStoreState, user: UserData) => void;
}

export interface UserStoreActions extends ActionTree<UserStoreState, RootStoreState> {
    loadAll: (context: ActionContext<UserStoreState, RootStoreState>) => void;
}

export interface UserStore extends Module<UserStoreState, RootStoreState> {
    namespaced: boolean;
    state: UserStoreState;
    getters: UserStoreGetters;
    mutations: UserStoreMutations;
    actions: UserStoreActions;
}