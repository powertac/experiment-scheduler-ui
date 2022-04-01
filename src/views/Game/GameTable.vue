<template>
  <div class="view">
    <div id="game-table" class="view">
      <div class="action-bar">
        <router-link to="/games/create">
          <fa-icon icon="plus" class="icon-left" /> New game
        </router-link>
        <input type="text" placeholder="search ..." v-model="search" />
      </div>
      <div class="loader" v-if="isLoading">
        LOADING
      </div>
      <table class="table datatable table-hover table-bordered clickable-rows" v-else>
        <thead>
        <tr>
          <th class="col-center">Status</th>
          <th class="col-center">ID</th>
          <th>Name</th>
          <th>Brokers</th>
          <th class="text-center">Created at</th>
          <th class="text-center">Completed at</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="game in games"
            :key="game.id"
            :class="{'selected': game.id === selectedGameId}"
            @click="showSidebar(game.id)"
            @dblclick="showDetails(game.id)">
          <td class="col-center status-icon">
            <span class="status-icon"><fa-icon :icon="statusIcon(game.status)" /></span>
          </td>
          <td class="col-center monospaced">{{game.id.substr(0, 8)}}</td>
          <td>{{game.name}}</td>
          <td class="mono" v-html="game.brokers.map((b) => b.name + ':<code>' + b.version + '</code>').join(', ')"></td>
          <td class="monospaced text-center">{{formatDate(game.createdAt)}}</td>
          <td class="monospaced text-center" v-html="formatDate(game.end)"></td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import {Component} from 'vue-property-decorator';
import {VueAdapter} from '@/VueAdapter';
import {formatDate} from '@/util/Date';
import {DataTable} from '@/util/DataTable';
import Game from '@/domain/Game/Game';

@Component
export default class GameTable extends VueAdapter {

  private isLoading: boolean;
  private search: string;

  constructor() {
    super();
    this.isLoading = true;
    this.search = '';
  }

  get selectedGameId(): string {
    return this.$route.params.id;
  }

  get games(): Game[] {
    const games = this.$store.getters['games/findAll'];
    return games.slice()
        .filter((g: Game) => DataTable.matchGames(this.search, g))
        .sort(DataTable.defaultSortGames);
  }

  private mounted() {
    this.$store.dispatch('games/loadAll')
        .then(() => this.isLoading = false)
        .catch(() => console.log("unable to load games"));
  }

  private showSidebar(id: string): void {
    this.$router.push({name: 'game', params: {'gameId': id}});
  }

  private showDetails(id: string): void {
    this.$router.push({name: 'game-details', params: {id}});
  }

  private formatDate(date: number): string {
    return formatDate(date);
  }

  private statusIcon(status: string): any {
    switch (status) {
      case 'queued':
        return ['far', 'clock'];
      case 'running':
        return ['fas', 'play'];
      case 'completed':
        return ['fas', 'check'];
      case 'failed':
        return ['fas', 'bolt'];
      case 'cancelled':
        return ['fas', 'times'];
    }
    return [];
  }

}
</script>

<style lang="scss">
#game-table {
  // TODO : move to global SCSS
  // TODO : show again when scrolling bar is active
  border-right: 0 !important;
}
tr.selected {
  background: #EBF6FC !important;
}
td.status-icon {
  width: 4rem;
}
span.status-icon {
  font-size: .66em;
}
</style>
