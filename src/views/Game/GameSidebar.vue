<template>
  <div id="game-sidebar">
    <div class="sidebar-actions">
      <router-link to="/games">
        <fa-icon icon="chevron-right" />
      </router-link>
    </div>
    <div class="game-data" v-if="game !== null">
      <h3 class="title">
        {{game.name}}
      </h3>
      <div class="actions-new">
        <router-link :to="'/games/' + gameId + '/details'" class="btn btn-sidebar">
          <fa-icon class="btn-icon" icon="expand" /> Show details
        </router-link>
        <router-link :to="'/games/create/' + gameId" class="btn btn-sidebar" :class="{'disabled': !game.isValidTemplate}">
          <fa-icon class="btn-icon" icon="copy"  /> Use as template
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
          <span class="label">Created at</span>
          <span class="value monospaced" v-html="formatDate(game.createdAt)"></span>
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
          <span class="value monospaced"><duration :start="game.start" :end="game.end" :should-tick="game.status === 'running'" /></span>
        </div>
      </div>
      <h5 class="section-header">Brokers</h5>
      <div class="brokers">
        <div class="broker" v-for="broker in game.brokers" :key="broker.id">
          {{broker.name}}
        </div>
      </div>
      <h5 class="section-header">Parameters</h5>
      <div class="params" v-if="Object.values(game.serverParameters).length > 0">
        <div class="param" v-for="param in Object.keys(game.serverParameters)">
          <code>{{param}} = {{game.serverParameters[param]}}</code>
        </div>
      </div>
      <p v-else>No parameters configured</p>
    </div>
  </div>
</template>

<script lang="ts">
import {Component} from 'vue-property-decorator';
import {VueAdapter} from '@/VueAdapter';
import * as Date from '@/util/Date';
import Duration from '@/components/time/Duration.vue';
import {Game} from '@/domain/Game/Game';

@Component({components: {duration: Duration}})
  export default class GameSidebar extends VueAdapter {

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
      padding: 2rem;
      padding-bottom: 1rem;
      display: flex;
      justify-content: left;
      .btn {
        margin-right: .5rem;
        transition: none;
        color: #3071F2;
        //background: #EBF6FC;
        border: 1px solid #ddd;
        background: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        border-radius: 50%;
        height: 2.8rem;
        width: 2.8rem;
        &:hover, &:active {
          background: #3071F2;
          color: #fff;
          border-color: transparent;
          box-shadow: 0 0 0 .2rem rgba(0,123,255,.25)
        }
        &.disabled {
          color: #888;
        }
      }

    }

    .sidebar-actions {
      display: flex;
      align-items: center;
      justify-content: right;
      //border-bottom: 1px solid #ddd;
      height: 2.75rem;
      a {
        margin-top: .5rem;
        margin-right: .5rem;
        transition: none;
        color: #3071F2;
        //background: #EBF6FC;
        //border: 1px solid #ddd;
        //background: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        border-radius: 50%;
        height: 2.5rem;
        width: 2.5rem;
        &:hover, &:active {
          background: #3071F2;
          color: #fff;
          border-color: transparent;
          box-shadow: 0 0 0 .2rem rgba(0,123,255,.25)
        }
      }
    }

    .title {
      padding: .2rem 2rem;
      margin: 0;
      margin-bottom: 1rem;
    }

    .section-header {
      margin: 0;
      //border-bottom: 1px solid #ddd;
      padding: .75rem 2rem .25rem 2rem;
      //margin-bottom: -1.875rem;
      color: #8898aa;
      font-size: .875em;
      text-transform: uppercase;
    }

    .section-header + p {
      padding: 0 2rem .66rem 2rem;
      margin-top: 1rem;
      font-style: italic;
      color: #212529;
      margin: 0;
    }

    div.brokers, div.params {
      padding: 0 2rem 1rem 2rem;
      code {
        color: #212529;
      }
    }

    div.game-meta {
      padding: 1rem 2rem;
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

  .actions-new {
    //border-bottom: 1px solid #ddd;
  }

  .actions-new a {
    display: flex;
    align-items: center;
    width: 100%;
    text-align: left;
    padding: .7rem 2rem .66rem 2rem;
    //background: rgba(255,255,255,.5);
    //border-top: 1px solid #ddd;
    border-radius: 0;
    transition: none;
    color: #3071F2;
    .btn-icon {
      //width: 1rem;
      margin-right: .5rem;
    }
    &:hover {
      background: #3071F2;
      color: #fff;
    }
    &.disabled {
      color: #888;
    }
  }

</style>
