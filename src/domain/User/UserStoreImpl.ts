import Vue from "vue";
import {ActionContext} from "vuex";
import {RootStoreState} from "@/domain/Store/RootStore";
import api from "@/api/api";
import {UserStore, UserStoreState} from "@/domain/User/UserStore";
import {User} from "@/domain/User/User";
import {RegistrationToken} from "@/domain/User/RegistrationToken";

const userStoreImpl: UserStore = {
    namespaced: true,
    state: {
        current: null,
        users: {},
        registrations: {},
    },
    getters: {
        current: (state: UserStoreState) => {
            return state.current;
        },
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
        findRegistrations: (state) => {
            return Object.values(state.registrations);
        }
    },
    mutations: {
        setCurrent: (state, user) => {
            Vue.set(state, 'current', new User(user));
        },
        add: (state, user) => {
            if (undefined === user.id) {
                console.error('cannot add user due to missing id');
                return;
            }
            Vue.set(state.users, user.id, new User(user));
        },
        addRegistration: (state, registration) => {
            Vue.set(state.registrations, registration.id, new RegistrationToken(registration));
        }
    },
    actions: {
        loadCurrent: (context: ActionContext<UserStoreState, RootStoreState>) => {
            api.orchestrator.users.getCurrent()
                .then((user) => context.commit('setCurrent', user))
                .catch((error) => console.error("could not load current user", error));
        },
        loadAll: (context: ActionContext<UserStoreState, RootStoreState>) => {
            api.orchestrator.users.getAll()
                .then((users) => users.forEach((user) => context.commit('add', user)))
                .catch((error) => console.error(error));
        },
        loadRegistrations: (context: ActionContext<UserStoreState, RootStoreState>) => {
            api.orchestrator.users.getRegistrations()
                .then((registrations) => registrations.forEach((r) => context.commit('addRegistration', r)))
                .catch((error) => console.error(error));
        }
    },
};

export {userStoreImpl};
