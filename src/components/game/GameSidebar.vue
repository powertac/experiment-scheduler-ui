<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import * as Date from '@/util/Date';
import Duration from '@/components/time/Duration.vue';
import {Baseline} from '@/domain/Baseline/Baseline';
import moment from 'moment';
import {OrchestratorClient} from '@/api/OrchestratorClient';
import Game from '@/domain/Game/Game';
import GameStatusBlock from '@/components/game/GameStatusBlock.vue';

@Component({components: {GameStatusBlock, Duration}})
export default class GameSidebar extends Vue {

  @Prop({required: true})
  private game: Game;

  get baseline(): Baseline|null {
    return this.game.baselineId === null
        ? null
        : this.$store.getters['baselines/find'](this.game.baselineId);
  }

  get hasRelationships(): boolean {
    return this.game.baseline !== null
        || this.game.treatment !== null
        || this.game.base !== null;
  }

  get weatherDate(): string|null {
    return this.game.weather === null
        ? null
        : moment(this.game.weather.startTime).format("L");
  }

  private formatDate(date: number|null): string {
    return Date.formatDate(date);
  }

  private rerun(): void {
    if (this.game.status === 'completed' || this.game.status === 'failed') {
      OrchestratorClient.rerunGame(this.game)
    }
  }

  private deleteGame(): void {
    OrchestratorClient.deleteGame(this.game)
        .then(() => this.$store.commit('games/remove', this.game));
  }

}
</script>

<template>
  <div>
    <h3 class="sidebar-title">
      {{game.name}}
    </h3>
    <game-status-block :game="game" />
    <div class="game-actions">
      <router-link :to="'/games/' + game.id + '/runs'" class="button">
        <fa-icon icon="eye" class="icon" />
        Details
      </router-link>
      <button class="button" @click="rerun"
              :class="{'disabled': game.status !== 'completed' && game.status !== 'failed'}"
              :disabled="game.status !== 'completed' && game.status !== 'failed'">
        <fa-icon icon="redo" class="icon" />
        Rerun
      </button>
    </div>
    <div class="game-meta">
      <div class="game-meta-atom">
        <span class="label">ID</span>
        <span class="value monospaced">{{game.id}}</span>
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
    <div class="game-meta" v-if="hasRelationships">
      <div class="game-meta-title">
        Relationships
      </div>
      <div class="game-meta-atom" v-if="game.base !== null">
        <span class="label">Base game</span>
        <span class="value"><router-link :to="'/game/' + game.base.id">{{game.base.name}}</router-link></span>
      </div>
      <div class="game-meta-atom" v-if="game.treatment !== null">
        <span class="label">Treatment</span>
        <span class="value"><router-link :to="'/treatments/' + game.treatment.id + '/details'">{{game.treatment.name}}</router-link></span>
      </div>
      <div class="game-meta-atom" v-if="game.baseline !== null">
        <span class="label">Baseline</span>
        <span class="value"><router-link :to="'/baselines/' + game.baselineId + '/details'">{{baseline.name}}</router-link></span>
      </div>
    </div>
    <div class="game-meta">
      <div class="game-meta-title">
        Brokers
      </div>
      <div class="game-meta-atom" v-for="broker in game.brokers">
        <span class="label key">{{broker.name}}</span>
        <span class="value">{{broker.version}}</span>
      </div>
    </div>
    <div class="game-meta" v-if="game.weather !== null">
      <div class="game-meta-title">
        Weather conditions
      </div>
      <div class="game-meta-atom">
        <span class="label">Location</span>
        <span class="value text-capitalize">{{game.weather.location}}</span>
      </div>
      <div class="game-meta-atom">
        <span class="label">Start date</span>
        <span class="value monospaced">{{weatherDate}}</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.game-status-block {
  margin: 0 1rem .66rem 1rem;
}
div.game-meta {
  border: 1px solid #CBD5E1;
  background: #fff;
  border-radius: .2rem;
  margin: 0 1rem .66rem 1rem;
  padding: .66rem 0;

  .game-meta-title {
    font-size: .75em;
    text-transform: uppercase;
    padding-left: 1rem;
    margin-bottom: .1rem;
  }

  div.game-meta-atom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: .2rem 0;

    &:last-child {
      border-bottom: 0;
    }

    span.label {
      color: #64748B;
      font-size: .75em;
      text-transform: uppercase;
      padding: 0 1rem;

      &.key {
        font-size: 1em;
        text-transform: none;
        color: #1E293B;
      }
    }

    span.value {
      padding-right: 1rem;
      line-height: 1;
      &.monospaced {
        font-family: "Inconsolata", monospace;
      }
    }
  }
}

div.game-actions {
  margin: 0 1rem .66rem 1rem;
  display: flex;

  .button {
    padding: .33em .66em;
    display: flex;
    align-items: center;
    background: #EFF6FF;
    border-color: #60A5FA;
    color: #1D4ED8;
    text-decoration: none;

    &:hover {
      background: #BFDBFE;
      border-color: #2563EB;
      color: #1E3A8A;
    }

    &.disabled {
      background: #E2E8F0;
      border-color: #94A3B8;
      color: #64748B;
    }

    .icon {
      font-size: .875em;
      margin-right: .66em;
    }
  }

  .button + .button {
    border-left-width: 0;
    &:hover {
      border-left-width: 1px;
      margin-left: -1px;
    }
  }
}
</style>
