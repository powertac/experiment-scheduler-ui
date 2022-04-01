<template>
  <div class="game-run-header">
    <div class="run-status"
         :class="{'run-status-failed': run.phase === 'DONE' && run.failed, 'run-status-completed': run.phase === 'DONE' && !run.failed}">
      <fa-icon class="run-status-icon" :icon="statusIcon" />
      {{run.phase}}
    </div>
    <div class="run-timing">
      <date :date="run.start" />
      <fa-icon class="start-to-end" icon="arrow-right" />
      <date :date="run.end" />
    </div>
    <div class="run-duration">
      Duration:
      <duration :start="run.start" :end="run.end === null ? -1 : run.end" :should-tick="true" />
    </div>
    <div class="run-id">
      Run ID:
      {{run.id}}
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import {GameRun} from '@/domain/Game/GameRun';
import FormattedDate from '@/components/time/FormattedDate.vue';
import Duration from '@/components/time/Duration.vue';

@Component({name: 'run-header', components: {Duration, 'date': FormattedDate}})
export default class GameRunHeader extends Vue {

  @Prop({required: true})
  private run: GameRun;

  get statusIcon(): string|string[] {
    switch (this.run.phase) {
      case "NONE": return ["far", "clock"];
      case "PREPARING":
      case "BOOTSTRAP":
      case "READY":
      case "SIMULATION":
        return "play";
      case "DONE": return this.run.failed
          ? "bolt"
          : "check";
    }
    return "";
  }

}
</script>

<style lang="scss" scoped>
div.game-run-header {
  display: flex;
  align-items: center;
  & > div {
    padding: .33rem .66rem;
    border-right: 1px solid #D4D4D8;
  }
}
div.run-status {
  display: flex;
  align-items: center;
  .run-status-icon {
    font-size: .75em;
    margin-right: .5rem;
  }
  &.run-status-failed {
    color: #E11D48;
  }
  &.run-status-completed {
    color: #059669;
  }
}
div.run-timing {
  .start-to-end {
    font-size: .75em;
    margin: 0 .5rem;
  }
}
</style>

