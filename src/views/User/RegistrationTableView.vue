<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import UserTable from "@/components/User/UserTable.vue";
import RegistrationTable from "@/components/Registration/RegistrationTable.vue";
import {RegistrationToken} from "@/domain/User/RegistrationToken";

@Component({components: {RegistrationTable, UserTable}})
export default class RegistrationTableView extends Vue {

  private loading: boolean;

  constructor() {
    super();
    this.loading = true;
  }

  private mounted(): void {
    this.$store.dispatch('users/loadRegistrations')
        .then(() => this.loading = false);
  }

  get registrations(): RegistrationToken[] {
    return this.$store.getters['users/findRegistrations'];
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
    <div class="loader" v-if="loading">
      LOADING
    </div>
    <div class="view-content" v-else>
      <div class="view-content-main">
        <registration-table :registrations="registrations" />
      </div>
    </div>
  </div>
</template>