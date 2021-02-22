import {JobState} from "@/domain/types/Job";
<template>
  <div id="game-details" class="view">
    <div class="action-bar">
      <a @click="$router.go(-1)">
        <fa-icon class="icon" icon="arrow-left" />
        Back
      </a>
    </div>
    <div class="container-fluid" v-if="experiment === null">
      <div class="row">
        <div class="col">
          Loading...
        </div>
      </div>
    </div>
    <div class="container-fluid" v-else>
      <div class="row">
        <div class="col">
          <h1>{{experiment.name}} <small>@{{experiment.hash.substring(0,8)}}</small></h1>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <h2>Baseline</h2>
          <table class="table info-table" v-if="experiment.baseline.length > 0">
            <thead>
            <tr>
              <th class="text-center">Index</th>
              <th>Brokers</th>
              <th>Parameters</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(instance, index) in experiment.baseline" >
              <td class="text-center"><strong>{{instanceIndex(index)}}</strong></td>
              <td>
                <div v-for="broker in instance.brokers">
                  {{broker.name}} <!--<code>[{{broker.name}}:{{broker.version}}]</code>-->
                </div>
              </td>
              <td>
                <div v-for="param in instance.serverParameters">
                  <code>{{param.key}} = {{param.value}}</code>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
          <p v-else>
            <em>There is no baseline defined for this experiment. This should not happen...</em>
          </p>
        </div>
      </div>
      <div class="row mt-4">
        <div class="col-md-6">
          <h2>Treatments</h2>
          <table class="table info-table" v-if="experiment.treatments.length > 0">
            <thead>
            <tr>
              <th class="text-center">Index</th>
              <th>Type</th>
              <th>Modifier</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(treatment, index) in experiment.treatments" >
              <td class="text-center"><strong>{{index}}</strong></td>
              <td>
                <div v-if="treatment.type === 'Change broker set'">
                  <span v-if="treatment.mutation.action === 'ADD'">Add broker</span>
                  <span v-else>Remove broker</span>
                </div>
                <div v-else>
                  Set parameters
                </div>
              </td>
              <td>
                <div v-if="treatment.type === 'Set server parameter'">
                  <div v-for="param in treatment.mutation.parameters">
                    <code>{{param.key}} = {{param.value}}</code>
                  </div>
                </div>
                <div v-else>
                  {{treatment.mutation.broker.name}} <!--<code>[{{treatment.mutation.broker.name}}:{{treatment.mutation.broker.version}}]</code>-->
                </div>
              </td>
            </tr>
            </tbody>
          </table>
          <p v-else>
            <em>There are no treatments defined for this experiment. This should not happen...</em>
          </p>
        </div>
      </div>
      <div class="row mt-4 mb-5">
        <div class="col-md-6">
          <h2>Games</h2>
          <table class="table info-table" v-if="experiment.instances.length > 0">
            <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Status</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="instance in experiment.instances" >
              <td><code>{{instance.id}}</code></td>
              <td>
                <router-link :to="'/games/' + instance.id + '/details'">
                  {{instance.name}}
                </router-link>
              </td>
              <td class="game-status" :class="stateClass(instance)">{{ instance.status.state }}</td>
            </tr>
            </tbody>
          </table>
          <p v-else>
            <em>There were no games created for this experiment. This should not happen...</em>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from "vue-property-decorator";
  import {Experiment} from "@/domain/Experiment/Experiment";
  import {JobState} from "@/domain/types/Job";
  import {Game} from "@/domain/Game/Game";

  @Component()
  export default class ExperimentDetails extends Vue {

    get hash(): string {
      return this.$route.params.hash;
    }

    get experiment(): Experiment {
      return this.$store.getters['experiments/one'](this.hash);
    }

    private created(): void {
      this.$store.dispatch('experiments/refresh');
    }

    private instanceIndex(index: number): string {
      const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
      return alphabet[index];
    }

    private stateClass(game: Game): {[key: string]: boolean} {
      return {
        'queued': game.status.state === JobState.queued,
        'running': game.status.state === JobState.running,
        'completed': game.status.state === JobState.completed,
        'failed': game.status.state === JobState.failed,
      };
    }

  }
</script>

<style lang="scss" scoped>
  h1 {
    margin: 3rem 0;
    small {
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
        padding: 1rem 3rem;
        border: 1px solid #e9e9e9;
        border-radius: .2em;
        width: 100%;
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
        &.failed {
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
    td code {
      color: #212529;
    }
    td.game-status {
      vertical-align: center;
      font-family: "Inconsolata", monospace;
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
      &.failed {
        background: #FFD9E1;
        color: #B81F40;
        border-color: #DB768C;
      }
    }
  }
  h2 {
    font-size: 1.75em;
    color: #999;
  }
</style>

