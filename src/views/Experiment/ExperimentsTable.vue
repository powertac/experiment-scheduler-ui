import {JobState} from "@/domain/types/Job";
<template>
  <div id="experiment-table" class="view">
    <div class="experiments-actions">
      <router-link to="/experiments/create">
        <fa-icon icon="plus" />
      </router-link>
    </div>
    <table class="table data-table table-hover table-bordered">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <!--<th>Baseline Size</th>-->
          <!--<th>Treatment Size</th>-->
          <th>Progress</th>
        </tr>
      </thead>
      <tbody>
      <tr v-for="experiment in experiments" :key="experiment.id" @click="showDetails(experiment.hash)">
        <td class="monospaced">{{experiment.hash.substr(0,8)}}</td>
        <td>{{experiment.name}}</td>
        <!--<td class="monospaced">{{experiment.baseline.length}}</td>-->
        <!--<td class="monospaced">{{experiment.treatments.length}}</td>-->
        <td class="monospaced">
          <div class="progress">
            <div class="progress-bar progress-failed" role="progressbar" :style="progress(experiment, 'FAILED')" v-if="instancesPerStateCount(experiment, 'FAILED') > 0">
              {{instancesPerStateCount(experiment, 'FAILED')}}
            </div>
            <div class="progress-bar progress-completed" role="progressbar" :style="progress(experiment, 'COMPLETED')" v-if="instancesPerStateCount(experiment, 'COMPLETED') > 0">
              {{instancesPerStateCount(experiment, 'COMPLETED')}}
            </div>
            <div class="progress-bar progress-running" role="progressbar" :style="progress(experiment, 'RUNNING')" v-if="instancesPerStateCount(experiment, 'RUNNING') > 0">
              {{instancesPerStateCount(experiment, 'RUNNING')}}
            </div>
            <div class="progress-bar progress-queued" role="progressbar" :style="progress(experiment, 'QUEUED')" v-if="instancesPerStateCount(experiment, 'QUEUED') > 0">
              {{instancesPerStateCount(experiment, 'QUEUED')}}
            </div>
          </div>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
  import {Component} from "vue-property-decorator";
  import {VueAdapter} from "@/VueAdapter";
  import {Experiment} from "@/domain/Experiment/Experiment";
  import {JobState} from "@/domain/types/Job";

  @Component({})
  export default class ExperimentsTable extends VueAdapter {

    get experiments(): Experiment[] {
      return this.$store.getters['experiments/all'];
    }

    mounted() {
      this.$store.dispatch('experiments/refresh').then(() => {
        // TODO : add loading indication
      }).catch(() => {
        // TODO : show fatal error message
      });
    }

    private showDetails(hash: string): void {
      this.$router.push({name: 'experimentDetails', params: {hash}});
    }

    private progress(experiment: Experiment, state: string): any {
      return { width: this.instancesPerStateCount(experiment, state) / experiment.instances.length * 100 + "%" }
    }

    private instancesPerStateCount(experiment: Experiment, state: string): number {
      return experiment.instances.filter(instance => instance.status.state === (state as JobState)).length;
    }
  }
</script>

<style lang="scss" scoped>

div.experiments-actions {
  position: sticky;
  top: 0;
  display: flex;
  align-items: stretch;
  background: var(--nav-option-bg);
  background: #fff;
  border-bottom: 1px solid #ddd;
  height: 2.75rem;

  input[type=text] {
    flex-grow: 1;
    border: 0;
    border-radius: 0;
    padding: .5rem 1rem;
    background: #fff;
    font-family: "Inconsolata", monospace;
  }

  label.filter-toggle, a {
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 0 1rem;
    color: #3071F2;
    margin: 0;
    background: #fff;
    &:hover {
      background: #040DBF;
      background: #3071F2;
      color: #fff;
    }
  }
}

  table.data-table {
    border: 0;
    border-collapse: separate;
    border-spacing: 0;
    margin-bottom: 0;

    &.table-hover tbody tr:hover {
      background: #fafbfc;
    }

    td, th {
      border-width: 0;
      border-bottom-width: 1px;
      border-right-width: 1px;

      &:last-child {
        border-right-width: 0;
      }

      &.col-center {
        text-align: center;
      }
    }

    & > thead {
      position: sticky;
      top: 2.75rem;

      & > tr > th {
        font-weight: normal;
        border-bottom-width: 1px;
        color: #727f8e;
        background-color: #eee;
        border-color: #dbdfe2;
        text-transform: uppercase;
        font-size: .75em;
        padding-top: .6rem;
        padding-bottom: .5rem;
      }
    }

    tr > td {
      padding-top: .5rem;
      padding-bottom: .5rem;
    }

    & > tbody > tr {
      cursor: pointer;

      & > td {

        &.monospaced {
          font-family: "Inconsolata", monospace;
        }

        span.state-icon {
          font-size: .66em;
        }

        .progress {
          height: 1.5rem;
        }
      }
    }
  }
  .progress .progress-bar {
    font-weight: bold;
    border-right: 1px solid #000;
    &:last-child {
      border-right: 0;
    }
    &.progress-queued {
      background: #e9e9e9;
      color: #333;
      border-color: #ccc;
      border-width: 0;
    }
    &.progress-running {
      background: #F3EDFF;
      color: #7300E6;
      border-color: #CFB8E6;
    }
    &.progress-completed {
      background: #E0FFF5;
      color: #00804A;
      border-color: #97cbaa;
    }
    &.progress-failed {
      background: #FFD9E1;
      color: #B81F40;
      border-color: #DB768C;
    }
  }
</style>
