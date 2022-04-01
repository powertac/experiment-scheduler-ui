<template>
  <div class="game-run-selector">
    <div class="toggle-run-selection" :class="{'active': showOptions}" @click="showOptions = !showOptions" v-if="runs.length > 1">
      <fa-icon icon="chevron-down" />
    </div>
    <run-header :run="selectedRun" v-if="selectedRun !== null" />
    <div class="selectable-runs" v-if="showOptions">
      <div class="selectable-run" v-for="run in runs" :key="run.id" @click="selectedRun = run; showOptions = false">
        {{run.id}}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Emit, Prop, Vue, Watch} from 'vue-property-decorator';
import {GameRun} from '@/domain/Game/GameRun';
import GameRunHeader from '@/components/game/GameRunHeader.vue';
import RunHeader from '@/components/game/GameRunHeader.vue';

@Component({name: 'game-run-selector', components: {RunHeader, GameRunHeader}})
export default class GameRunSelector extends Vue {

  @Prop({required: true})
  private runs: GameRun[];

  private selectedRun: GameRun|null;
  private showOptions: boolean;

  constructor() {
    super();
    this.selectedRun = null;
    this.showOptions = false;
  }

  private mounted(): void {
    if (this.runs.length > 0) {
      this.selectedRun = <GameRun> this.runs.slice()
          .sort((a, b) => b.start - a.start)[0];
    }
  }

  @Watch('selectedRun')
  @Emit('run-selected')
  private onSelectedRunChange(selected: GameRun): GameRun {
    return selected;
  }

}
</script>

<style lang="scss" scoped>
.game-run-selector {
  display: flex;
  align-items: stretch;
  background: #F1F5F9;
  border-bottom: 1px solid #D4D4D8;
  font-family: "Inconsolata", monospace;
  z-index: 310;
  position: relative;
}
.selected-run {
  z-index: 310;
  background: #F1F5F9;
  flex-grow: 1;
  display: flex;
  align-items: center;
  padding: 0 .66rem;
}
.toggle-run-selection {
  display: flex;
  align-items: center;
  padding: .5rem .66rem;
  cursor: pointer;
  z-index: 310;
  background: #F1F5F9;
  border-right: 1px solid #D4D4D8;
  &.active {
    background: #CBD5E1;
  }
}
.selectable-runs {
  border-right: 1px solid #D4D4D8;
  position: absolute;
  top: calc(100% + 1px);
  left: 0;
  background: #F1F5F9;
  z-index: 300;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
}
.selectable-run {
  white-space: nowrap;
  padding: .1rem .5rem;
  cursor: pointer;
  &:hover {
    background: #CBD5E1;
  }
}
</style>
