<script lang="ts">
import {Component} from 'vue-property-decorator';
import {VueAdapter} from '@/VueAdapter';
import {DataTable} from '@/util/DataTable';
import Game from '@/domain/Game/Game';
import GameTable from '@/components/game/GameTable.vue';
import GameSidebar from '@/components/game/GameSidebar.vue';

@Component({components: {GameSidebar, GameTable}})
export default class GameTableView extends VueAdapter {

  private isLoading: boolean;
  private search: string;
  private selectedGame: Game|null;

  constructor() {
    super();
    this.isLoading = true;
    this.search = '';
    this.selectedGame = null;
  }

  private mounted() {
    this.$store.dispatch('games/loadAll')
        .then(() => this.isLoading = false)
        .catch(() => console.log("unable to load games"));
  }

  // TODO : load per search
  // TODO : load per filter
  // TODO : load next

  get games(): Game[] {
    const games = this.$store.getters['games/findAll'];
    return games.slice()
        .filter((g: Game) => DataTable.matchGames(this.search, g))
        .sort(DataTable.defaultSortGames);
  }

}
</script>

<template>
  <div>
    <div class="action-bar">
      <router-link to="/games/create">
        <fa-icon icon="plus" class="icon-left" /> New game
      </router-link>
      <input type="text" placeholder="search ..." v-model="search" />
    </div>
    <div class="loader" v-if="isLoading">
      LOADING
    </div>
    <div class="view-content" v-else>
      <div class="view-content-main">
        <game-table :games="games" @game-selected="selectedGame = $event" />
      </div>
      <game-sidebar :game="selectedGame" v-if="selectedGame !== null" class="view-content-sidebar" />
    </div>

  </div>
</template>


