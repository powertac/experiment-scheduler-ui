<template>
  <div class="view">
    <div id="treatment-details" class="view">
      <div class="action-bar">
        <router-link to="/treatments">
          <fa-icon icon="arrow-left" class="icon" /> Back
        </router-link>
      </div>
      <template v-if="treatment !== null">
        <treatment-header :treatment="treatment" />
        <table class="table datatable table-hover table-bordered clickable-rows">
          <thead>
          <tr>
            <th class="col-center">Status</th>
            <th class="col-center">ID</th>
            <th>Name</th>
            <th>Location</th>
            <th class="text-right">Simulation Time</th>
            <th>Brokers</th>
            <th class="text-right">Completed at</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="game in treatment.games" :key="game.id" @click="showSidebar(game)">
            <td class="col-center status-icon">
              <span class="status-icon"><status-icon :game="game" /></span>
            </td>
            <td class="col-center monospaced">{{game.id.substr(0, 8)}}</td>
            <td>{{game.name}}</td>
            <td>{{game.weather.location}}</td>
            <td class="monospaced text-right" v-html="formatWeatherDate(game.weather.startTime)"></td>
            <td>{{game.brokers.map((b) => b.name).join(", ")}}</td>
            <td class="monospaced text-right" v-html="formatDate(game.end)"></td>
          </tr>
          </tbody>
        </table>
      </template>
      <div class="loader" v-else>
        LOADING...
      </div>
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

@Component({components: {FormatDate, TreatmentHeader, 'status-icon': GameStatusIcon}})
export default class TreatmentView extends Vue {

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
