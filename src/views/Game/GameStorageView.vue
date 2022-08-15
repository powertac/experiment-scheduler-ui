<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import Game from '@/domain/Game/Game';
import GameViewHeader from '@/components/game/GameViewHeader.vue';
import GameClient from '@/api/GameClient';
import FormattedFileSize from '@/components/file/FormattedFileSize.vue';
import Files from '@/util/Files';
import GameRunStorageSize from '@/components/game/GameRunStorageSize.vue';
import {GameRun} from '@/domain/Game/GameRun';

@Component({components: {GameRunStorageSize, FormattedFileSize, GameViewHeader}})
export default class GameStorageView extends Vue {

  private gameFileSize: number|null;
  private runFileSizes: Map<String, number>;

  constructor() {
    super();
    this.gameFileSize = null;
    this.runFileSizes = new Map<String, number>();
  }

  private mounted(): void {
    this.$store.dispatch('games/load', this.gameId)
        .catch((error) => console.error("could not load game", error));
    GameClient.gameBytes(this.gameId)
        .then((size) => this.gameFileSize = size)
        .catch((error) => console.error("could not load game storage size", error));
  }

  get gameId(): string {
    return this.$route.params.id;
  }

  get game(): Game {
    return this.$store.getters['games/find'](this.gameId);
  }

  get formattedGameBytes(): string {
    return Files.formatBytes(this.gameFileSize);
  }

  private runStatus(run: GameRun): string {
    if (run.phase !== 'DONE') {
      return '&mdash;';
    } else if (run.failed) {
      return 'FAILED';
    } else {
      return 'SUCCESS';
    }
  }

  private filesRemovable(run: GameRun): boolean {
    return run.phase === 'DONE' && run.failed;
  }

  private removeRunFiles(run: GameRun): void {
    GameClient.removeRunFiles(run.id)
        .then()
        .catch((error) => console.error("could not remove run files", error));
  }

}
</script>

<template>
  <div class="game-view">
    <div class="loader" v-if="game === null">
      LOADING
    </div>
    <template v-else>
      <game-view-header :game="game" />
      <div class="game-storage-content">
        <table class="key-value">
          <thead>
          <tr>
            <th>Run ID</th>
            <th class="text-center">Phase</th>
            <th class="text-center">Status</th>
            <th class="text-right">Size</th>
            <th></th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="run in game.runs" :key="run.id">
            <td class="mono">{{run.id}}</td>
            <td class="mono text-center">{{run.phase}}</td>
            <td class="mono text-center" v-html="runStatus(run)">{{run.failed}}</td>
            <td class="text-right"><game-run-storage-size :run="run" /></td>
            <td>
              <button class="button" v-if="filesRemovable(run)" @click="removeRunFiles(run)">
                <fa-icon icon="trash" class="button-icon-left" /> remove files
              </button>
            </td>
          </tr>
          <tr class="aggregate">
            <td colspan="3">Total size<sup>1</sup> :</td>
            <td class="text-right" colspan="1">{{formattedGameBytes}}</td>
            <td></td>
          </tr>
          </tbody>
        </table>
        <p><sup>1</sup> total size of game files includes files that are not part of individual runs (e.g. bootstrap record).</p>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
div.game-storage-content {
  padding: 2rem;
  display: flex;
}
</style>

