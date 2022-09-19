<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import GameViewHeader from '@/components/game/GameViewHeader.vue';
import GameClient from '@/api/GameClient';
import FormattedFileSize from '@/components/file/FormattedFileSize.vue';
import GameRunStorageSize from '@/components/game/GameRunStorageSize.vue';
import {GameRun} from '@/domain/Game/GameRun';
import api from "@/api/api";

@Component({components: {GameRunStorageSize, FormattedFileSize, GameViewHeader}})
export default class StorageView extends Vue {

  private failedRuns: GameRun[];

  constructor() {
    super();
    this.failedRuns = [];
  }

  private mounted(): void {
    api.orchestrator.games.failed()
        .then((runs) => this.failedRuns.push(...runs))
        .catch((error) => console.error("could not load failed runs", error));
  }

  get runs(): GameRun[] {
    if (this.failedRuns === undefined) {
      return [];
    }
    return this.failedRuns.slice().sort((a, b) => a.start - b.start);
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
    <div class="view-content-main">
      <h1 class="mx-5 mt-5">Failed Runs</h1>
      <table class="key-value mx-5 mb-5">
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
        <tr v-for="run in runs" :key="run.id">
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
          <td class="text-right" colspan="1">NOT YET IMPLEMENTED</td>
          <td></td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.game-view {
  overflow-y: scroll;
}
</style>

