<template>
  <div id="game-table" class="view">
    <div class="experiments-actions">
      <router-link to="/games/create">
        <fa-icon icon="plus" />
      </router-link>
      <!--
      <label for="table-filter" class="filter-toggle" @click="isLoading = !isLoading">
        <fa-icon icon="spinner" pulse v-if="isLoading" />
        <fa-icon icon="filter" v-else />
      </label>
      <input type="text" id="table-filter" placeholder="enter filter ..." />
      <label for="table-filter" class="filter-toggle">
        <fa-icon icon="sort-amount-up" />
      </label>
      -->
    </div>
    <table class="table data-table table-hover table-bordered">
      <thead>
        <tr>
          <th class="col-center">Status</th>
          <th>ID</th>
          <th>Name</th>
          <th>Experiment</th>
          <th>Agents</th>
          <th>Start</th>
          <th>End</th>
          <th>Duration</th>
        </tr>
      </thead>
      <tbody>
      <tr v-for="job in jobs" :key="job.id" @click="showDetails(job.id)">
        <td class="col-center">
          <state-tag class="state-icon" :state="job.status.state" />
        </td>
        <td class="monospaced">{{job.id}}</td>
        <td>{{job.name}}</td>
        <td>
          <span v-if="job.experiment !== null">{{job.experiment.name}}</span>
          <span v-else>&mdash;</span>
        </td>
        <td>
          {{job.brokers.sort((a, b) => (a.name >= b.name)).map((b) => b.name).join(", ")}}
        </td>
        <td class="monospaced" v-html="formatDate(job.status.start)"></td>
        <td class="monospaced" v-html="formatDate(job.status.end)"></td>
        <td class="monospaced"><duration :start="job.status.start" :end="job.status.end" /></td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
  import {Component} from "vue-property-decorator";
  import {VueAdapter} from "@/VueAdapter";
  import {Job, JobState} from "@/domain/types/Job";
  import * as Date from '@/util/Date';
  import Duration from "@/components/time/Duration.vue";
  import JobStateTag from "@/components/JobStateTag.vue";

  @Component({components: {duration: Duration, 'state-tag': JobStateTag}})
  export default class GameDashboard extends VueAdapter {

    private isLoading: boolean;

    constructor() {
      super();
      this.isLoading = false;
    }

    get activeJobId(): string {
      return this.$route.params.id;
    }

    get jobs(): Job[] {
      let jobs = this.$store.getters['jobs/jobs'];
      jobs.sort((a: Job, b: Job) => b.status.start - a.status.start);
      return jobs;
    }
    
    private mounted() {
      this.$store.dispatch('jobs/listen').then(() => {
        // TODO : add loading indication
      }).catch(() => {
        // TODO : show fatal error message
      });
      this.$store.dispatch('jobs/refresh').then(() => {
        // TODO : add loading indication
      }).catch(() => {
        // TODO : show fatal error message
      });
    }

    private showDetails(id: string): void {
      this.$router.push({name: 'game', params: {id}});
    }

    private formatDate(date: number|null): string {
      return Date.formatDate(date);
    }

  }
</script>

<style lang="scss">

div.experiments-actions {
  position: sticky;
  top: 0;
  display: flex;
  align-items: stretch;
  background: var(--nav-option-bg);
  background: #fff;
  border-bottom: 1px solid #ddd;
  height: 2.75rem;

  a {
    height: calc(2.75rem - 1px);
  }

  input[type=text] {
    flex-grow: 1;
    border: 0;
    border-radius: 0;
    padding: .5rem 1rem;
    background: #fff;
    font-family: "Inconsolata", monospace;
    height: 2.75rem;
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

      &.active > td {
        color: #fff;
        background: #3071F2;
      }

      & > td {
        &.monospaced {
          font-family: "Inconsolata", monospace;
        }
        span.state-icon {
          font-size: .66em;
        }
      }
    }
  }



</style>
