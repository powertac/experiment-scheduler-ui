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
    <div class="container-fluid" v-else>
      <div class="row">
        <div class="col">
          <h1><small>@{{game.id}}</small><br>{{game.name}}</h1>
        </div>
      </div>
      <div class="row align-items-stretch" id="game-status-bar">
        <div class="col-sm-2 game-state-container">
          <div class="game-state">
            <div class="label">Status</div>
            <div class="value" :class="gameStatusClass">
              <fa-icon class="state-icon" :icon="statusIcon" />
              <span>{{game.status}}</span>
            </div>
          </div>
        </div>
        <div class="col-sm-2">
          <div class="game-status">
            <div class="label">Start</div>
            <div class="value"><span v-html="start"></span></div>
          </div>
          <div class="game-status">
            <div class="label">End</div>
            <div class="value" v-html="end"></div>
          </div>
          <div class="game-status">
            <div class="label">Duration</div>
            <div class="value"><duration :start="game.start" :end="game.end" :should-tick="game.status === 'running'" /></div>
          </div>
        </div>
      </div>
      <div class="row mt-5">
        <div class="col-md-6">
          <h2>Brokers</h2>
          <table class="table info-table" v-if="game.brokers.length > 0">
            <thead>
            <tr>
              <th>Broker</th>
              <th>Image</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="broker in game.brokers">
              <td>{{broker.name}}</td>
              <td><code>{{broker.version}}</code></td>
            </tr>
            </tbody>
          </table>
          <p v-else>
            <em>There are brokers configured for this game. This should never happen...</em>
          </p>
        </div>
      </div>
      <div class="row mt-4">
        <div class="col-md-6">
          <h2>Parameters</h2>
          <table class="table info-table" v-if="Object.values(game.serverParameters).length > 0">
            <thead>
            <tr>
              <th>Parameter</th>
              <th>Value</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="parameter in Object.keys(game.serverParameters)">
              <td><code>{{parameter}}</code></td>
              <td><code>{{game.serverParameters[parameter]}}</code></td>
            </tr>
            </tbody>
          </table>
          <p v-else>
            <em>There are no simulation parameters set for this game.</em>
          </p>
        </div>
      </div>
      <div class="row mt-4">
        <div class="col-md-6">
          <h2>Files</h2>
          <table class="table info-table" v-if="Object.values(game.files).length > 0">
            <thead>
            <tr>
              <th>File type</th>
              <th>Path</th>
            </tr>
            </thead>
            <tbody>
            <tr v-if="game.files['BOOTSTRAP'] !== undefined">
              <td>Bootstrap</td>
              <td><code>{{ game.files['BOOTSTRAP'] }}</code></td>
            </tr>
            <tr v-if="game.files['PROPERTIES'] !== undefined">
              <td>Properties</td>
              <td><code>{{ game.files['PROPERTIES'] }}</code></td>
            </tr>
            <tr v-if="game.files['SEED'] !== undefined">
              <td>Seed</td>
              <td><code>{{ game.files['SEED'] }}</code></td>
            </tr>
            <tr v-if="game.files['STATE_LOG'] !== undefined">
              <td>State log</td>
              <td><code>{{ game.files['STATE_LOG'] }}</code></td>
            </tr>
            <tr v-if="game.files['TRACE_LOG'] !== undefined">
              <td>Trace log</td>
              <td><code>{{ game.files['TRACE_LOG'] }}</code></td>
            </tr>
            </tbody>
          </table>
          <p v-else>
            <em>There are no files available for this game.</em>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import Duration from '@/components/time/Duration.vue';
import * as Date from '@/util/Date';
import {Game} from '@/domain/Game/Game';

@Component({components: {duration: Duration}})
export default class GameDetails extends Vue {

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

}
</script>

<style lang="scss" scoped>
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
</style>

