<template>
  <div class="view">
    <div id="game-table" class="view">
      <div class="action-bar">
        <router-link to="/games/create">
          <fa-icon icon="plus" class="icon-left" /> New game
        </router-link>
        <input type="text" placeholder="enter filter ..." v-model="search" />
      </div>
      <div class="loader" v-if="isLoading">
        LOADING
      </div>
      <table class="table datatable table-hover table-bordered" v-else>
        <thead>
        <tr>
          <th class="col-center">Status</th>
          <th>ID</th>
          <th>Name</th>
          <th>Brokers</th>
          <th>Created at</th>
          <th>Completed at</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="game in games"
            :key="game.id"
            :class="{'selected': game.id === selectedGameId}"
            @click="showDetails(game.id)">
          <td class="col-center monospaced text-uppercase">{{game.status}}</td>
          <td class="monospaced">{{game.id}}</td>
          <td>{{game.name}}</td>
          <td>{{game.brokers.map((b) => b.name).join(", ")}}</td>
          <td class="monospaced">{{formatDate(game.createdAt)}}</td>
          <td class="monospaced" v-html="formatDate(game.end)"></td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import {Component} from 'vue-property-decorator';
import {VueAdapter} from '@/VueAdapter';
import {Game} from '@/domain/Game/GameTypes';
import {formatDate} from '@/util/Date';
import {DataTable} from '@/util/DataTable';

@Component
export default class NewGameTable extends VueAdapter {

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
        .sort((a: Game, b: Game) => a.createdAt == b.createdAt ? 0 : b.createdAt - a.createdAt);
  }

  private mounted() {
    this.$store.dispatch('games/loadAll')
        .then(() => this.isLoading = false)
        .catch(() => console.log("unable to load games"));
  }

  private showDetails(id: string): void {
    this.$router.push({name: 'game', params: {id}});
  }

  private formatDate(date: number): string {
    return formatDate(date);
  }

}
</script>

<style lang="scss">
#game-table {
  // TODO : move to global SCSS
  border-right: 0 !important;
}
tr.selected {
  background: #EBF6FC !important;
}
</style>
