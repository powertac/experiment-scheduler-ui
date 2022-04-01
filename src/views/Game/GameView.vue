<template>
  <div class="game-view">
    <div class="action-bar">
      <a @click="$router.go(-1)">
        <fa-icon class="icon" icon="arrow-left" />
        Back
      </a>
    </div>
    <div class="loader" v-if="game === null">
      LOADING
    </div>
    <template v-else>
      <div class="game-view-header">
        <h1 class="game-view-title">
          {{game.name}}
          <small class="text-muted">ID: {{game.id}}</small>
        </h1>
        <div class="game-relationships">
          <div class="game-group" v-if="baseline !== null">
            Baseline: <router-link :to="'/baselines/' + baseline.id">{{baseline.name}}</router-link>
          </div>
          <div class="game-base"></div>
        </div>
      </div>
      <game-run-selector :runs="game.runs" @run-selected="selectRun" />
      <file-tree-viewer :root="selectedRunRootNode" v-if="selectedRunRootNode !== null" />
    </template>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import GameRunSelector from '@/components/game/GameRunSelector.vue';
import {GameRun} from '@/domain/Game/GameRun';
import FileTreeViewer from '@/components/file/FileTreeViewer.vue';
import {FileNode} from '@/domain/File/FileNode';
import {OrchestratorClient} from '@/api/OrchestratorClient';
import {Baseline} from '@/domain/Baseline/Baseline';
import Game from '@/domain/Game/Game';

@Component({components: {GameRunSelector, FileTreeViewer}})
export default class GameView extends Vue {

  private selectedRun: GameRun|null;
  private selectedRunRootNode: FileNode|null;

  constructor() {
    super();
    this.selectedRun = null;
    this.selectedRunRootNode = null;
  }

  private mounted(): void {
    this.$store.dispatch('games/load', this.gameId);
  }

  get gameId(): string {
    return this.$route.params.id;
  }

  get game(): Game {
    return this.$store.getters['games/find'](this.gameId);
  }

  get baseline(): Baseline|null {
    return this.game.baseline === null
        ? null
        : this.$store.getters['baselines/find'](this.game.baseline);
  }

  private selectRun(run: GameRun|null): void {
    this.selectedRun = run;
    if (null != run) {
      OrchestratorClient.runFiles(run.id)
          .then((node) => this.selectedRunRootNode = node)
          .catch((error) => console.log(error));
    }
  }

}
</script>

<style lang="scss" scoped>
div.game-view {
  display: flex;
  overflow: hidden;
  height: 100vh;
}
div.game-view-header {
  background: #F1F5F9;
  border-bottom: 1px solid #CBD5E1;
  padding: 2rem;

  .game-view-title {
    display: flex;
    flex-direction: column;
    font-size: 2rem;
    small {
      font-size: 1rem;
      font-family: "Inconsolata", monospace;
    }
  }
}
</style>

