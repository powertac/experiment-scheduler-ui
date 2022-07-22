<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import Game from '@/domain/Game/Game';
import GameStatusIcon from '@/components/game/GameStatusIcon.vue';
import Duration from '@/components/time/Duration.vue';

@Component({components: {Duration, GameStatusIcon}})
export default class GameStatusBlock extends Vue {

  @Prop({required: true})
  private game: Game;

  get classes(): {[name: string]: boolean} {
    const classes: {[name: string]: boolean} = {};
    classes[this.game.status] = true;
    return classes;
  }

}
</script>

<template>
  <div class="game-status-block" :class="classes">
    <game-status-icon :game="game" class="game-status-icon" />
    <span class="game-status-label">{{game.status}}</span>
  </div>
</template>

<style lang="scss" scoped>
div.game-status-block {
  border-width: 1px;
  border-style: solid;
  border-radius: .2rem;
  padding: .66rem;
  display: flex;
  justify-content: center;
  align-items: center;
  text-transform: uppercase;
  font-size: .75em;

  &.inline {

  }

  &.running {
    background: #E0E7FF;
    border-color: #818CF8;
    color: #4338CA;
  }
  &.queued {
    background: #fff;
    border-color: #CBD5E1;
    color: #334155;
  }
  &.completed {
    background: #CCFBF1;
    border-color: #14B8A6;
    color: #115E59;
  }
  &.failed {
    background: #FDF2F8;
    border-color: #F472B6;
    color: #9F1239;
  }
  &.cancelled {

  }

  .game-status-icon {
    margin-right: .66em;
  }
}
</style>
