<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import GameRunSelector from '@/components/game/GameRunSelector.vue';
import FileTreeViewer from '@/components/file/FileTreeViewer.vue';
import Game from '@/domain/Game/Game';
import FormattedDate from '@/components/time/FormattedDate.vue';
import FormatDate from '@/components/time/FormattedDate.vue';
import GameViewHeader from '@/components/game/GameViewHeader.vue';
import ParametersTable from '@/components/parameter/ParametersTable.vue';
import BrokersTable from '@/components/Broker/BrokersTable.vue';

@Component({components: {ParametersTable, GameViewHeader, BrokersTable, FormatDate, GameRunSelector, FileTreeViewer, FormattedDate}})
export default class GameConfigView extends Vue {

  private mounted(): void {
    this.$store.dispatch('games/load', this.gameId);
  }

  get gameId(): string {
    return this.$route.params.id;
  }

  get game(): Game {
    return this.$store.getters['games/find'](this.gameId);
  }

}
</script>

<template>
  <div class="game-view">
    <!--<div class="action-bar">
      <a @click="$router.go(-1)">
        <fa-icon class="icon" icon="arrow-left" />
        Back
      </a>
    </div>-->
    <div class="loader" v-if="game === null">
      LOADING
    </div>
    <template v-else>
      <game-view-header :game="game" />
      <div class="game-config">
        <div class="game-config-block">
          <h3>Brokers</h3>
          <brokers-table :brokers="game.brokers" />
        </div>
        <div class="game-config-block">
          <h3>Parameters</h3>
          <parameters-table :parameters="game.serverParameters" />
        </div>
        <div class="game-config-block">
          <h3 class="text-center">Weather</h3>
          <table class="key-value flipped">
            <tbody>
            <tr>
              <th>Location</th>
              <td class="text-capitalize">{{game.weather.location}}</td>
            </tr>
            <tr>
              <th>Start date</th>
              <td class="text-center"><formatted-date :date="game.weather.startTime" format="L" /></td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!--<div class="game-view-header">
        <div class="game-view-header-block">
          <h1 class="game-view-title">{{game.name}}</h1>
          <table class="meta">
            <tr>
              <th>ID</th>
              <td class="mono">{{game.id}}</td>
            </tr>
            <tr>
              <th>Created at</th>
              <td class="mono"><format-date :date="game.createdAt" /></td>
            </tr>
            <tr v-if="game.baseline !== null">
              <th>Baseline</th>
              <td><router-link :to="'/baselines/' + game.baseline.id + '/details'">
                <fa-icon icon="seedling" class="link-icon" />
                {{game.baseline.name}}
              </router-link></td>
            </tr>
            <tr v-if="game.treatment !== null">
              <th>Treatment</th>
              <td><router-link :to="'/treatments/' + game.treatment.id">
                <fa-icon icon="code-branch" class="link-icon" />
                {{game.treatment.name}}
              </router-link></td>
            </tr>
            <tr v-if="game.base !== null">
              <th>Base game</th>
              <td><router-link :to="'/games/' + game.base.id + '/runs'">
                <fa-icon icon="dice-d6" class="link-icon" />
                {{game.base.name}}
              </router-link></td>
            </tr>
          </table>
        </div>
        <div class="game-view-header-block">
          <h2>Brokers</h2>
          <table class="brokers">
            <tr v-for="broker in game.brokers" :key="broker.id">
              <th>{{ broker.name }}</th>
              <td>{{ broker.version }}</td>
            </tr>
          </table>
        </div>
        <div class="game-view-header-block" v-if="game.weather !== null">
          <h2>Weather</h2>
          <table class="meta">
            <tr>
              <th>Location</th>
              <td>{{game.weather.location}}</td>
            </tr>
            <tr>
              <th>Start date</th>
              <td class="mono"><format-date :date="game.weather.startTime"/></td>
            </tr>
          </table>
        </div>
        <div class="game-view-header-block" v-if="Object.keys(game.serverParameters).length > 0">
          <h2>Parameters</h2>
          <table class="meta">
            <tr v-for="param in Object.keys(game.serverParameters)" :key="param">
              <th>{{param}}</th>
              <th>{{game.serverParameters[param]}}</th>
            </tr>
          </table>
        </div>
      </div>-->
    </template>
  </div>
</template>

<style lang="scss" scoped>
div.game-view {
  display: flex;
  overflow: hidden;
  height: 100vh;
  flex-direction: row;
}
div.game-view-header {
  .game-view-title {
    display: flex;
    flex-direction: column;
    font-size: 2rem;
    small {
      font-size: 1rem;
      font-family: "Inconsolata", monospace;
    }
  }
  div.game-view-header-block + div.game-view-header-block {
    border-left: 1px solid #CBD5E1;
  }
}
div.game-config {
  padding: 2rem;
  display: flex;
  gap: 4rem;

  table.key-value {
    width: auto;
  }

  div.game-config-block > h3 {
    margin-bottom: .66rem;
  }
}
</style>

