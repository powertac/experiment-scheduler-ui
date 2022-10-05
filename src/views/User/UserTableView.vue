<script lang="ts">

    import {Component, Vue} from 'vue-property-decorator';
    import {User} from "@/domain/User/User";
    import UserTable from "@/components/User/UserTable.vue";

    @Component({components: {UserTable}})
    export default class UserTableView extends Vue {

        private isLoading: boolean;
        private search: string;

        constructor() {
            super();
            this.isLoading = false;
            this.search = '';
        }

        private mounted(): void {
            this.$store.dispatch('users/loadAll');
        }

        get users(): User[] {
            return this.$store.getters['users/findAll'];
        }

    }
</script>

<template>
    <div id="users-table" class="view">
        <div class="action-bar">
          <router-link to="/registrations/">
            <fa-icon icon="plus" class="icon-left" /> Show Registrations
          </router-link>
          <router-link to="/registrations/create">
            <fa-icon icon="plus" class="icon-left" /> Create registration tokens
          </router-link>
        </div>
        <div class="loader" v-if="isLoading">
            LOADING
        </div>
        <div class="view-content" v-else>
            <div class="view-content-main">
                <user-table :users="users" />
            </div>
        </div>
    </div>
</template>