<template>
  <div class="view">
      <view-action-bar />
      <template v-if="treatment !== null">
        <treatment-header :treatment="treatment" />
        <div class="view-content">
          <div class="view-content-main">
            <game-table :games="treatment.games" @game-selected="selectedGame = $event" />
          </div>
          <game-sidebar :game="selectedGame" v-if="selectedGame !== null" class="view-content-sidebar" />
        </div>
      </template>
      <div class="loader" v-else>
        LOADING...
      </div>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {Treatment} from '@/domain/Treatment/Treatment';
import FormatDate from '@/components/time/FormattedDate.vue';
import GameRunSelector from '@/components/game/GameRunSelector.vue';
import FileTreeViewer from '@/components/file/FileTreeViewer.vue';
import FormattedDate from '@/components/time/FormattedDate.vue';
import moment from 'moment';
import { formatDate } from '@/util/Date';
import GameStatusIcon from '@/components/game/GameStatusIcon.vue';
import TreatmentHeader from '@/components/Treatment/TreatmentHeader.vue';
import Game from '@/domain/Game/Game';
import GameTable from '@/components/game/GameTable.vue';
import GameSidebar from '@/components/game/GameSidebar.vue';
import ViewActionBar from '@/components/application/ViewActionBar.vue';

@Component({components: {
    ViewActionBar,
    FormatDate, TreatmentHeader, 'status-icon': GameStatusIcon, GameTable, GameSidebar}})
export default class TreatmentView extends Vue {

  private selectedGame: Game|null;

  constructor() {
    super();
    this.selectedGame = null;
  }

  get treatmentId(): string {
    return this.$route.params.id;
  }

  get treatment(): Treatment<any>|null {
    return this.$store.getters['treatments/find'](this.treatmentId);
  }

  private showSidebar(game: Game): void {
    this.$router.push('/treatments/' + this.treatmentId + '/games/' + game.id)
  }

  private formatWeatherDate(date: number): string {
    return moment(date).format('L')
  }

  private formatDate(date: number): string {
    return formatDate(date);
  }

}
</script>

<style lang="scss">
div.game-view {
  display: flex;
  overflow: hidden;
  height: 100vh;
  flex-direction: row;
}
div.game-view-header {
  display: flex;
  background: #F1F5F9;
  border-bottom: 1px solid #CBD5E1;

  .game-view-title {
    display: flex;
    flex-direction: column;
    font-size: 2rem;
    small {
      font-size: 1rem;
      font-family: "Inconsolata", monospace;
    }
  }
  div.game-view-header-block {
    min-width: 18rem;
    padding: 1.75rem 2.33rem;
    h2 {
      font-size: 1.5rem;
    }
  }

  div.game-view-header-block + div.game-view-header-block {
    border-left: 1px solid #CBD5E1;
  }
}
</style>
