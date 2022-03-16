<template>
  <div id="game-run-details">
    <h1>{{run.id}}</h1>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import Duration from '@/components/time/Duration.vue';
import {GameRun} from '@/domain/Game/GameRun';

@Component({components: {duration: Duration}})
export default class GameRunDetails extends Vue {

  @Prop({required: true})
  private run: GameRun;

}
</script>

<style lang="scss" scoped>
</style>

