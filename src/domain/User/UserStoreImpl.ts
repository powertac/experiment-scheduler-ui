import Vue from "vue";
import {ActionContext} from "vuex";
import {RootStoreState} from "@/domain/Store/RootStore";
import {StompClient} from "@/api/StompClient";
import api from "@/api/api";
import {UserStore, UserStoreState} from "@/domain/User/UserStore";
import {User, UserData} from "@/domain/User/User";

const userStoreImpl: UserStore = {
    namespaced: true,
    state: {
        users: {},
    },
    getters: {
        find: (state: UserStoreState) => (id: string): User|null => {
            if (id in state.users) {
                return state.users[id];
            }
            return null;
        },
        findAll: (state: UserStoreState) => {
            return Object.values(state.users)
                .sort((a, b) => a.username.localeCompare(b.username));
        },
    },
    mutations: {
        add: (state, user) => {
            if (undefined === user.id) {
                console.error('cannot add user due to missing id');
                return;
            }
            Vue.set(state.users, user.id, new User(user));
        },
    },
    actions: {
        loadAll: (context: ActionContext<UserStoreState, RootStoreState>) => {
            api.orchestrator.users.getAll()
                .then((baselines) => baselines.forEach((baseline) => context.commit('add', baseline)))
                .catch((error) => console.error(error));
        },
    },
};

export {userStoreImpl};
