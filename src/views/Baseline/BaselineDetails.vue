<template>
  <div id="game-details" class="view">
    <div class="action-bar">
      <a @click="$router.go(-1)">
        <fa-icon class="icon" icon="arrow-left" />
        Back
      </a>
    </div>
    <div class="container-fluid" v-if="baseline === null">
      <div class="row">
        <div class="col">
          Loading...
        </div>
      </div>
    </div>
    <div class="status-header">
      <div class="status-primary">
        <h1 style="margin: 2rem 2rem 0 2rem">{{baseline.name}}</h1>
        <div class="baseline-nav">
          <button class="button" @click="activeTab = 'games'" :class="{'active': activeTab === 'games'}">
            Games
          </button>
          <button class="button" @click="activeTab = 'config'" :class="{'active': activeTab === 'config'}">
            Configuration
          </button>
        </div>
      </div>
      <div class="status-secondary">
        <div class="tuple-table">
          <div class="tuple">
            <div class="key mr-4">ID</div>
            <div class="value mono">{{baseline.id}}</div>
          </div>
          <div class="tuple">
            <div class="key">Created at</div>
            <div class="value mono">{{formatDate(baseline.createdAt)}}</div>
          </div>
          <div class="tuple">
            <div class="key">Progress</div>
            <div class="value mono">{{Math.floor(baseline.progress * 100)}}% ({{baseline.completedGames.length}}/{{baseline.games.length}})</div>
          </div>
          <div class="tuple">
            <div class="key">Status</div>
            <div class="value mono text-uppercase">{{baseline.status}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="block-container" v-if="activeTab === 'config'">
      <div class="block">
        <h5 class="block-title">Weather Configurations</h5>
        <table class="table datatable">
          <thead>
          <tr>
            <th>Location</th>
            <th class="text-right">Start Date</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="weather in baseline.weatherConfigurations">
            <td>{{weather.location}}</td>
            <td class="text-right mono">{{formatWeatherDate(weather.startTime)}}</td>
          </tr>
          </tbody>
        </table>
      </div>
      <div class="block ml-4">
        <h5 class="block-title">Broker Sets</h5>
        <table class="table datatable grouped">
          <thead>
          <tr>
            <th class="text-center">Set</th>
            <th>Name</th>
            <th>Version</th>
            <th>Image</th>
          </tr>
          </thead>
          <tbody v-for="[index, set] of baseline.brokerSets.entries()">
          <tr v-for="broker in set.brokers">
            <td class="text-center mono">{{index + 1}}</td>
            <td>{{broker.name}}</td>
            <td>{{broker.version}}</td>
            <td class="mono">{{broker.imageTag}}</td>
          </tr>
          </tbody>
        </table>
      </div>
      <div class="block ml-4">
        <h5 class="block-title">Parameters</h5>
        <table class="table datatable">
          <thead>
          <tr>
            <th>Parameter</th>
            <th>Value</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="param of Object.keys(baseline.commonParameters)">
            <td class="mono">{{param}}</td>
            <td class="mono">{{baseline.commonParameters[param]}}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="view-content" v-else>
      <div class="view-content-main">
        <game-table :games="games" @game-selected="selectedGame = $event" />
      </div>
      <game-sidebar :game="selectedGame" v-if="selectedGame !== null" class="view-content-sidebar" />
    </div>
    <!--<table class="table datatable table-hover table-bordered clickable-rows" v-if="activeTab === 'games'">
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
      <tr v-for="game in games" :key="game.id" @click="showSidebar(game)">
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
    </table>-->
    <div class="baseline-files" v-if="activeTab === 'files'">
      <h3>FILES</h3>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import Duration from '@/components/time/Duration.vue';
import {Baseline} from '@/domain/Baseline/Baseline';
import {DataTable} from '@/util/DataTable';
import GameStatusIcon from '@/components/game/GameStatusIcon.vue';
import {formatDate} from '@/util/Date';
import moment from 'moment';
import Game from '@/domain/Game/Game';
import GameTable from '@/components/game/GameTable.vue';
import GameSidebar from '@/components/game/GameSidebar.vue';

@Component({components: {GameTable, duration: Duration, 'status-icon': GameStatusIcon, GameSidebar}})
export default class BaselineDetails extends Vue {

  private activeTab: string;
  private selectedGame: Game|null;

  constructor() {
    super();
    this.activeTab = 'games';
    this.selectedGame = null;
  }

  private mounted(): void {
    this.$store.dispatch('baselines/loadAll');
  }

  get baselineId(): string {
    return this.$route.params.id;
  }

  get baseline(): Baseline {
    return this.$store.getters['baselines/find'](this.baselineId);
  }

  get games(): Game[] {
    return this.baseline.games.sort((DataTable.defaultSortGames));
  }

  private showSidebar(game: Game): void {
    this.$router.push('/baselines/' + this.baselineId + '/details/' + game.id)
  }

  private formatWeatherDate(date: number): string {
    return moment(date).format('L')
  }

  private formatDate(date: number): string {
    return formatDate(date);
  }

}
</script>

<style lang="scss" scoped>
div.status-header {
  background: #fafafa;
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: space-between;

  div.status-secondary {
    margin: 2rem 3rem;
  }

  div.status-primary {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    h1 {width: 100%}
  }

  div.baseline-nav {
    padding: 1rem 2rem 0 2rem;
    margin-bottom: -1px;
    align-self: flex-end;

    button {
      border: 0;
      background: inherit;
      padding: .5rem 1rem;
      color: #3071F2;

      &.active {
        color: #3071F2;
        border-bottom: 1px solid #3071F2;
        //background-image: radial-gradient(3rem at left 50% bottom -2rem, transparentize(#3071F2, .66) 0%, transparent 100%);
      }

      &:active, &:focus {
        outline: none;
      }
    }
  }
}
</style>

