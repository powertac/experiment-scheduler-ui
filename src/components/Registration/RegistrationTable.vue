<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import {RegistrationToken} from "@/domain/User/RegistrationToken";

@Component
export default class RegistrationTable extends Vue {

    @Prop({required: true})
    private registrations: RegistrationToken[];

}
</script>

<template>
    <table class="table datatable table-hover table-bordered clickable-rows">
        <thead>
        <tr>
            <th class="text-right">ID</th>
            <th class="text-center">Issued at</th>
            <th>Issued by</th>
            <th class="text-center">Claimed at</th>
            <th>Claimed by</th>
            <th class="text-center">Expires at</th>
            <th>Token</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="registration in registrations" :key="registration.id">
            <td class="text-right mono">{{registration.id}}</td>
            <td class="text-center mono">{{registration.issuedAt.format('L HH:ss')}}</td>
            <td>{{registration.issuedBy.username}}</td>
            <td class="text-center mono">{{registration.claimedAt !== null ? registration.claimedAt.format('L HH:ss') : '-'}}</td>
            <td>{{registration.claimedBy !== null ? registration.claimedBy.username : '-'}}</td>
            <td class="text-center mono">{{registration.expirationDate.format('L HH:ss')}}</td>
            <td class="mono token-cell">{{registration.token.substr(60, 32)}}</td>
        </tr>
        </tbody>
    </table>
</template>

<style lang="scss">
.token-cell {
  max-width: 14rem;
  word-wrap: break-word;
}
</style>