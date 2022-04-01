<template>
  <fa-icon :icon="icon" />
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import Game from '@/domain/Game/Game';

@Component
export default class GameStatusIcon extends Vue {

  @Prop({required: true})
  private game: Game;

  get icon(): string[] {
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

<style scoped lang="scss">
</style>
