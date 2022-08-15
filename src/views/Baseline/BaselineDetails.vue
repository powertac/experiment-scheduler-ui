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
import BaselineClient from '@/api/BaselineClient';
import ApplicationClient from '@/api/ApplicationClient';

@Component({components: {GameTable, duration: Duration, 'status-icon': GameStatusIcon, GameSidebar}})
export default class BaselineDetails extends Vue {

  private activeTab: string;
  private selectedGame: Game|null;
  private exportMessage: string;
  private exportTarget: string;
  private hostUri: string;
  private hostExportBasePath: string;

  constructor() {
    super();
    this.activeTab = 'games';
    this.selectedGame = null;
    this.exportMessage = "Just copy and paste for now ... ;)";
    this.exportTarget = "";
    this.hostUri = "";
    this.hostExportBasePath = "";
  }

  private mounted(): void {
    this.$store.dispatch('baselines/loadAll');
    ApplicationClient.hostExportBasePath()
        .then((hostExportBasePath) => this.hostExportBasePath = hostExportBasePath)
        .catch((error) => console.log("could not load host base export path", error));
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

  private exportBaseline(): void {
    Vue.set(this, 'exportMessage', 'Exporting to ' + this.exportTarget + ' ...');
    BaselineClient.export(this.baseline.id, this.exportTarget, this.hostUri)
        .then(() => Vue.set(this, 'exportMessage', 'Exported successfully.'))
        .catch((error) => {
          console.error(error);
          Vue.set(this, 'exportMessage', 'Export failed!');
        });
  }

  private formatWeatherDate(date: number): string {
    return moment(date).format('L')
  }

  private formatDate(date: number): string {
    return formatDate(date);
  }

}
</script>

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
          <button class="button" @click="activeTab = 'export'" :class="{'active': activeTab === 'export'}">
            Export
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
    <div class="p-5"  v-else-if="activeTab === 'export'">
      <h2 class="mb-4">Export files</h2>
      <p><strong>USE WITH CARE! ANOTHER QUICK N DIRTY FEATURE!</strong></p>
      <div>
        <h4 class="mt-4">Target directory (relative to export path)</h4>
        <div class="input-block">
          <div class="input-prefix">{{ hostExportBasePath }}</div>
          <input type="text" v-model="exportTarget" placeholder="path/to/baseline/export" class="text-input w-50" />
        </div>
        <h4 class="mt-3">Host URI</h4>
        <input type="text" v-model="hostUri" placeholder="https://host.uri/" class="text-input w-50" />
        <button class="button mt-4 submit-button" @click="exportBaseline">export</button>
        <p class="mt-4">{{exportMessage}}</p>
      </div>
    </div>
    <div class="view-content" v-else>
      <div class="view-content-main">
        <game-table :games="games" @game-selected="selectedGame = $event" />
      </div>
      <game-sidebar :game="selectedGame" v-if="selectedGame !== null" class="view-content-sidebar" />
    </div>
  </div>
</template>

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
.submit-button {
  display: block;
}
</style>

