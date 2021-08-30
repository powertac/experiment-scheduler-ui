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
    <div class="game-data" v-if="game !== null">
      <h3 class="title">
        {{game.name}}
      </h3>
      <div class="actions" v-if="game.isValidTemplate">
        <router-link :to="'/games/create/' + gameId" class="btn btn-primary btn-block">
          <fa-icon class="btn-icon" icon="clone" />
          Use as template
        </router-link>
      </div>
      <div class="game-meta">
        <div class="game-meta-atom">
          <span class="label">ID</span>
          <span class="value monospaced">{{game.id}}</span>
        </div>
        <div class="game-meta-atom">
          <span class="label">Status</span>
          <span class="value monospaced text-uppercase">{{game.status}}</span>
        </div>
        <div class="game-meta-atom">
          <span class="label">Start</span>
          <span class="value monospaced" v-html="formatDate(game.start)"></span>
        </div>
        <div class="game-meta-atom">
          <span class="label">End</span>
          <span class="value monospaced" v-html="formatDate(game.end)"></span>
        </div>
        <div class="game-meta-atom">
          <span class="label">Duration</span>
          <span class="value monospaced"><duration :start="game.start" :end="game.end" /></span>
        </div>
      </div>
      <h5 class="section-header">Brokers</h5>
      <div class="brokers">
        <div class="broker" v-for="broker in game.brokers" :key="broker.id">
          {{broker.name}}
        </div>
      </div>
      <h5 class="section-header">Parameters</h5>
      <div class="params">
        <div class="param" v-for="param in Object.keys(game.serverParameters)">
          <code>{{param}} = {{game.serverParameters[param]}}</code>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Component} from 'vue-property-decorator';
import {VueAdapter} from '@/VueAdapter';
import * as Date from '@/util/Date';
import Duration from '@/components/time/Duration.vue';
import JobStateTag from '@/components/JobStateTag.vue';
import {Game} from '@/domain/Game/GameTypes';

@Component({components: {duration: Duration, 'state-tag': JobStateTag}})
  export default class NewGameSidebar extends VueAdapter {

    get gameId(): string {
      return this.$route.params.id;
    }

    get game(): Game {
      return this.$store.getters['games/find'](this.gameId);
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

    .actions {
      padding: 1rem 2rem 0 2rem;

      .btn-icon {
        margin-right: .5rem;
      }
    }

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
