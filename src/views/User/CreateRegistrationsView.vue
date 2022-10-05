<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {RegistrationToken} from "@/domain/User/RegistrationToken";
import RegistrationTable from "@/components/Registration/RegistrationTable.vue";
import api from "@/api/api";
@Component({
  components: {RegistrationTable}
})
export default class CreateRegistrationsView extends Vue {

  private immediatlyCreatedTokens: RegistrationToken[];

  constructor() {
    super();
    this.immediatlyCreatedTokens = [];
  }

  private createToken(): void {
    api.orchestrator.users.createRegistrationToken()
        .then(token => this.immediatlyCreatedTokens.push(new RegistrationToken(token)))
        .catch(error => console.error("could not create new registration token", error));
  }

}
</script>

<template>
  <div id="registrations-table" class="view">
    <div class="action-bar">
      <router-link to="/registrations/create">
        <fa-icon icon="plus" class="icon-left" /> Create Registration
      </router-link>
    </div>
    <div class="view-content-main">
      <h1>Create Tokens</h1>
      <button class="button" @click="createToken">Create new registration token</button>
      <registration-table :registrations="immediatlyCreatedTokens" />
    </div>
  </div>
</template>