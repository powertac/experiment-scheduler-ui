<template>
  <div id="game-details" class="view">
    <div class="action-bar">
      <a @click="$router.go(-1)">
        <fa-icon class="icon" icon="arrow-left" />
        Back
      </a>
    </div>
    <div class="container-fluid" v-if="game === null">
      <div class="row">
        <div class="col">
          Loading...
        </div>
      </div>
    </div>
    <div v-else>
      <div class="status-header">
        <div class="status-primary">
          <h1 style="margin: 2rem 2rem 0 2rem">{{game.name}}</h1>
          <div class="baseline-nav">
            <button class="button" @click="activeTab = 'config'" :class="{'active': activeTab === 'config'}">
              Configuration
            </button>
            <button class="button" @click="activeTab = 'runs'" :class="{'active': activeTab === 'runs'}">
              Runs
            </button>
          </div>
        </div>
        <div class="status-secondary">
          <div class="tuple-table">
            <div class="tuple">
              <div class="key mr-4">ID</div>
              <div class="value mono">{{game.id}}</div>
            </div>
            <div class="tuple">
              <div class="key">Status</div>
              <div class="value mono text-uppercase">{{game.status}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="block-container" v-if="activeTab === 'config'">
        <div class="block" v-if="game.weather !== undefined && game.weather !== null">
          <h5 class="block-title">Weather Configuration</h5>
          <table class="table datatable">
            <thead>
            <tr>
              <th>Location</th>
              <th class="text-right">Start Date</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>{{game.weather.location}}</td>
              <td class="text-right mono">{{formatWeatherDate(game.weather.startTime)}}</td>
            </tr>
            </tbody>
          </table>
        </div>
        <div class="block ml-4">
          <h5 class="block-title">Brokers</h5>
          <table class="table datatable">
            <thead>
            <tr>
              <th>Name</th>
              <th>Version</th>
              <th>Image</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="broker in game.brokers">
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
            <tr v-for="param of Object.keys(game.serverParameters)">
              <td class="mono">{{param}}</td>
              <td class="mono">{{game.serverParameters[param]}}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
      <runs :game="game" v-if="game !== undefined && activeTab === 'runs'" />
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import * as Date from '@/util/Date';
import moment from 'moment';
import GameRunSelector from '@/components/game/GameRunSelector.vue';
import FileTreeViewer from '@/components/file/FileTreeViewer.vue';
import Game from '@/domain/Game/Game';

@Component({components: {GameRunSelector, FileTreeViewer}})
export default class GameDetails extends Vue {

  private activeTab: string;
  private activeRun: string;

  constructor() {
    super();
    this.activeTab = 'runs'
    this.activeRun = '';
  }

  private mounted(): void {
    this.$store.dispatch('games/load', this.gameId);
  }

  get gameId(): string {
    return this.$route.params.id;
  }

  get game(): Game {
    return this.$store.getters['games/find'](this.gameId);
  }

  get start(): string {
    return Date.formatDate(this.game.start);
  }

  get end(): string {
    return Date.formatDate(this.game.end);
  }

  get gameStatusClass(): {[key: string]: boolean} {
    let styleClass: any = {};
    styleClass[this.game.status] = true;
    return styleClass;
  }

  get statusIcon(): any {
    switch (this.game.status) {
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

  private formatWeatherDate(date: number): string {
    return moment(date).format('L')
  }

  private formatRunDate(date: number): string {
    return moment(date).format('L LT');
  }

}
</script>

<style lang="scss" scoped>

div.run {
  .run-details {
    display: none;
  }
  &.active .run-details {
    display: flex;
  }
}


  h1 {
    margin: 2rem 0 3rem 0;
    small {
      text-transform: uppercase;
      font-size: .4em;
      color: #777;
    }
  }
  .row > div:first-child {
    margin-left: 3rem;
  }
  #game-status-bar {
    padding-top: 0;
    padding-bottom: 0;
    background: #fafafa;
    border-top: 1px solid #e9e9e9;
    border-bottom: 1px solid #e9e9e9;

    & > div {
      padding-top: 2rem;
      padding-bottom: 2rem;
    }

    div.game-state, div.game-status {
      display: block;
      div.label {
        text-transform: uppercase;
        color: #8898aa;
      }
      div.value {
        .icon {
          margin-right: .33rem;
          font-size: .875em;
        }
      }
    }
    div.game-state div {
      text-align: center;
      &.value {
        font-weight: bold;
      }
    }
    div.game-status {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      div.value {
        font-family: "Inconsolata", monospace;
      }
    }
    .game-state-container {
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;

      .game-state div.label {
        display: none;
        margin-bottom: .25rem;
      }

      .game-state div.value {
        display: flex;
        align-items: center;
        padding: 1rem 3rem;
        border: 1px solid #e9e9e9;
        border-radius: .2em;
        width: 100%;
        .state-icon {
          margin-right: .5rem;
        }
        &.queued {
          background: #fff;
          color: #333;
          border-color: #ccc;
        }
        &.running {
          background: #F3EDFF;
          color: #7300E6;
          border-color: #CFB8E6;
          .value-box-title {
            color: #7300E6;
          }
        }
        &.completed {
          background: #E0FFF5;
          color: #00804A;
          border-color: #97cbaa;
        }
        &.failed, &.cancelled {
          background: #FFD9E1;
          color: #B81F40;
          border-color: #DB768C;
        }
      }
    }
  }
  ul.game-config-list {
    list-style: none;
    padding-left: .2rem;
    li {
      font-size: 1.1em;
      &:before {
        content: "\2013";
        margin-right: .5em;
      }
    }
  }
  table.table.info-table {
    tr > td:first-child, tr > th:first-child {
      padding-left: .15em;
    }
    tr > td:last-child, tr > th:last-child {
      padding-right: .15em;
    }
    td, th {
      font-size: 1.1em;
      border-color: #f0f0f0;
    }
    thead > tr > th {
      color: #8f8f8f;
      font-size: .875em;
      font-weight: normal;
      text-transform: uppercase;
      border-bottom-width: 0;
      padding-top: .5rem;
      padding-bottom: .1em;
    }
    tbody > tr > td {
      border: 0;
      padding-bottom: .33em;
      padding-top: .33em;
    }
    td > code {
      color: #212529;
    }
  }
  h2 {
    font-size: 1.75em;
    color: #212529;
  }
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
  div.run {
    div.run-header {
      cursor: pointer;
      display: flex;
      align-items: center;
      background: #fafafa;
      padding: 1rem 2rem;
      border-bottom: 2px solid #ddd;

      & > * {
        margin-right: 2rem;
      }
    }
    &.active {
      div.run-header {
        border-color: #3071F2;
      }
      svg {color: #3071F2}
    }
  }
</style>

