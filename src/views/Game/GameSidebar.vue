<template>
  <div id="game-sidebar">
    <div class="sidebar-actions">
      <router-link to="/games">
        <fa-icon icon="times" />
      </router-link>
      <router-link :to="'/games/' + gameId + '/details'">
        <fa-icon icon="expand" />
      </router-link>
    </div>
    <h3 class="title">
      {{game.name}}
    </h3>
    <div class="game-meta">
      <div class="game-meta-atom">
        <span class="label">Experiment</span>
        <span class="value ">
          <router-link v-if="game.experiment !== null" :to="'/experiments/'+game.experiment.hash+'/details'">{{game.experiment.name}}</router-link>
          <span v-else>&mdash;</span>
        </span>
      </div>
      <div class="game-meta-atom">
        <span class="label">ID</span>
        <span class="value monospaced">{{game.id}}</span>
      </div>
      <div class="game-meta-atom">
        <span class="label">Status</span>
        <span class="value monospaced">{{game.status.state}}</span>
      </div>
      <div class="game-meta-atom">
        <span class="label">Start</span>
        <span class="value monospaced" v-html="formatDate(game.status.start)"></span>
      </div>
      <div class="game-meta-atom">
        <span class="label">End</span>
        <span class="value monospaced" v-html="formatDate(game.status.end)"></span>
      </div>
      <div class="game-meta-atom">
        <span class="label">Duration</span>
        <span class="value monospaced"><duration :start="game.status.start" :end="game.status.end" /></span>
      </div>
    </div>
    <h5 class="section-header">Brokers</h5>
    <div class="brokers">
      <div class="broker" v-for="broker in game.brokers" :key="broker.id">
        {{broker.type.name}}  <code>[{{broker.type.image}}]</code>
      </div>
    </div>
    <h5 class="section-header">Parameters</h5>
    <div class="params">
      <div class="param" v-for="param in game.config['simulation-parameters']">
        <code>{{param.parameter}} = {{param.value}}</code>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Prop} from "vue-property-decorator";
  import {VueAdapter} from "@/VueAdapter";
  import {Job, JobState} from "@/domain/types/Job";
  import * as Date from '@/util/Date';
  import Duration from "@/components/time/Duration.vue";
  import JobStateTag from "@/components/JobStateTag.vue";

  @Component({components: {duration: Duration, 'state-tag': JobStateTag}})
  export default class GameSidebar extends VueAdapter {

    get gameId(): string {
      return this.$route.params.id;
    }

    get game(): Job {
      return this.$store.getters['jobs/job'](this.gameId);
    }

    private formatDate(date: number|null): string {
      return Date.formatDate(date);
    }

  }
</script>

<style lang="scss" scoped>

  #game-sidebar {
    padding: 0 0 4rem 0;
    background: #fafafa;

    .sidebar-actions {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #ddd;
      height: 2.75rem;
      a {
        color: #0C3CE8;
        padding: .66rem 1rem;
        height: calc(2.75rem - 1px);
        &:hover {
          background: #0C3CE8;
          color: #fff;
        }
      }
    }

    .title {
      padding: 1rem 2rem;
      margin: 0;
      border-bottom: 1px solid #ddd;

    }

    .section-header {
      margin: 0;
      //border-bottom: 1px solid #ddd;
      padding: .75rem 2rem .66rem 2rem;
      margin-bottom: -1.875rem;
      color: #888;
    }

    div.brokers, div.params {
      padding: 1.5rem 2rem 1.75rem 2rem;
      code {
        color: #212529;
      }
    }

    div.params {
      padding: 1.5rem 2rem 1.75rem 2rem;
    }

    div.game-meta {
      padding: 1rem 2rem 1.75rem 2rem;
      div.game-meta-atom {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        span.label {
          color: #8898aa;
          font-size: .875em;
          text-transform: uppercase;
        }
        span.value {
          &.monospaced {
            font-family: "Inconsolata", monospace;
          }
        }
      }
    }
  }

</style>
