<template>
  <div id="baseline-table" class="view">
    <div class="action-bar">
      <router-link to="/baselines/create">
        <fa-icon icon="plus" class="icon-left" /> New baseline
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
            <th>Baseline Size</th>
            <th>progress</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="baseline in baselines" :key="baseline.id" @click="details(baseline.id)">
            <td class="col-center status-icon">
              <span class="status-icon">
                <fa-icon icon="check" v-if="baseline.progress === 1" />
                <fa-icon icon="play" v-else-if="baseline.isRunning" />
                <fa-icon v-else-if="baseline.failedGames.length > 1" icon="bolt" v-else />
                <fa-icon :icon="['far', 'clock']" v-else />
              </span>
            </td>
            <td class="col-center monospaced">{{baseline.id.substr(0, 8)}}</td>
            <td>{{baseline.name}}</td>
            <td>{{baseline.games.length}}</td>
            <td>
              <div class="progress">
                <div class="progress-bar " role="progressbar" v-bind:style="{width: baseline.progress * 100 + '%'}" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
                  {{ baseline.completedGames.length }} / {{baseline.games.length}}
                </div>
                <div v-if="baseline.isRunning" class="progress-bar bg-success" role="progressbar" v-bind:style="{width: 1 / baseline.games.length * 100 + '%'}" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                <div v-if="baseline.failedGames.length > 0" class="progress-bar bg-danger" role="progressbar" v-bind:style="{width: baseline.failedGames.length / baseline.games.length * 100 + '%'}" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
                  {{ baseline.failedGames.length }} / {{baseline.games.length}}
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
import {Component} from 'vue-property-decorator';
import {VueAdapter} from '@/VueAdapter';
import {Baseline} from '@/domain/Baseline/Baseline';

@Component
export default class BaselineTable extends VueAdapter {

  private isLoading: boolean;
  private search: string;

  constructor() {
    super();
    this.isLoading = false;
    this.search = '';
  }

  private mounted(): void {
    this.$store.dispatch('baselines/loadAll');
  }

  get baselines(): Baseline[] {
    return this.$store.getters['baselines/findAll'];
  }

  private details(baselineId: string): void {
    this.$router.push('/baselines/' +baselineId + '/details');
  }

}
</script>

<style lang="scss">
</style>
