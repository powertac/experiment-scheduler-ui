<template>
  <div class="view">
    <div id="baseline-table" class="view">
      <div class="action-bar">
        <router-link to="/baselines/create">
          <fa-icon icon="plus" class="icon-left" /> New baseline
        </router-link>
        <!--<input type="text" placeholder="search ..." v-model="search" />-->
      </div>
      <div class="loader" v-if="isLoading">
        LOADING
      </div>
      <table class="table datatable table-hover table-bordered" v-else>
        <thead>
        <tr>
          <th class="col-center">ID</th>
          <th>Name</th>
          <th>Number of games</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="baseline in baselines"
            :key="baseline.id">
          <td class="col-center monospaced">{{baseline.id.substr(0, 8)}}</td>
          <td>{{baseline.name}}</td>
          <td>{{baseline.games.length}}</td>
        </tr>
        </tbody>
      </table>
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

  get baselines(): Baseline[] {
    return [];
  }

}
</script>

<style lang="scss">
</style>
