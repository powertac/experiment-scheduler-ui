<template>
  <div id="baseline-table" class="view">
    <div class="action-bar">
      <router-link to="/treatments/editor">
        <fa-icon icon="plus" class="icon-left" /> New treatment
      </router-link>
    </div>
    <div class="loader" v-if="isLoading">
      LOADING
    </div>
    <div class="view-content" v-else>
      <div class="view-content-main">
        <table class="table datatable table-hover table-bordered clickable-rows">
          <thead>
          <tr>
            <th class="text-center">Status</th>
            <th class="col-center">ID</th>
            <th>Name</th>
            <th>Treatment size</th>
            <th>Progress</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="treatment in treatments" :key="treatment.id" @click="showDetails(treatment)">
            <td class="col-center status-icon">
              <span class="status-icon">
                <fa-icon icon="check" v-if="treatment.progress === 1" />
                <fa-icon icon="play" v-else-if="treatment.isRunning" />
                <fa-icon v-else-if="treatment.failedGames.length > 1" icon="bolt" v-else />
                <fa-icon :icon="['far', 'clock']" v-else />
              </span>
            </td>
            <td class="col-center monospaced">{{treatment.id.substr(0, 8)}}</td>
            <td>{{treatment.name}}</td>
            <td>{{treatment.games.length}}</td>
            <td>
              <div class="progress">
                <div class="progress-bar " role="progressbar" v-bind:style="{width: treatment.progress * 100 + '%'}" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
                  {{ treatment.completedGames.length }} / {{treatment.games.length}}
                </div>
                <div v-if="treatment.isRunning" class="progress-bar bg-success" role="progressbar" v-bind:style="{width: 1 / treatment.games.length * 100 + '%'}" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                <div v-if="treatment.failedGames.length > 0" class="progress-bar bg-danger" role="progressbar" v-bind:style="{width: treatment.failedGames.length / treatment.games.length * 100 + '%'}" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
                  {{ treatment.failedGames.length }} / {{treatment.games.length}}
                </div>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {Treatment} from '@/domain/Treatment/Treatment';

@Component
export default class TreatmentTable extends Vue {

  private isLoading: boolean;
  private search: string;

  constructor() {
    super();
    this.isLoading = true;
    this.search = '';
  }

  private mounted() {
    this.$store.dispatch('treatments/loadAll')
      .then(() => this.isLoading = false)
      .catch((error) => console.error(error))
  }

  get treatments(): Treatment<any>[] {
    return this.$store.getters['treatments/findAll'];
  }

  private showDetails(treatment: Treatment<any>): void {
    this.$router.push('/treatments/' + treatment.id + '/games');
  }

}
</script>

<style lang="scss">
</style>
