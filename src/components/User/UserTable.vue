<script lang="ts">
    import {Component, Vue, Prop} from 'vue-property-decorator';
    import {User} from "@/domain/User/User";

    @Component
    export default class UserTable extends Vue {

        @Prop({required: true})
        private users: User[];

    }
</script>

<template>
    <table class="table datatable table-hover table-bordered clickable-rows">
        <thead>
        <tr>
            <th class="col-center">ID</th>
            <th>Username</th>
            <th>Roles</th>
            <th class="text-center">Status</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="user in users" :key="user.id">
            <td class="col-center monospaced">{{user.id.substr(0, 8)}}</td>
            <td>{{user.username}}</td>
            <td>{{user.roles.join(", ")}}</td>
            <td class="text-center">{{ user.enabled ? 'ENABLED' : 'DISABLED' }}</td>
        </tr>
        </tbody>
    </table>
</template>