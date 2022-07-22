<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import ViewActionBar from '@/components/application/ViewActionBar.vue';
import GameEditor from '@/components/game/GameEditor.vue';
import {OrchestratorClient} from '@/api/OrchestratorClient';
import {GameSpec} from '@/domain/Game/GameSpec';

@Component({name: "new-game", components: {ViewActionBar, GameEditor}})
export default class NewGameView extends Vue {

  private submit(spec: GameSpec): void {
    OrchestratorClient.createGame(spec)
        .then(this.complete)
        .catch(this.error);
  }

  private complete(): void {
    console.log('created new game')
    this.$router.push('/games')
    // TODO : 1. add success message; 2. redirect to games
  }

  private error(error: Error): void {
    console.error(error);
  }

}
</script>

<template>
  <div>
    <view-action-bar />
    <div class="view-content scrollable">
      <div class="container">
        <h1 class="editor-title">New Game</h1>
        <game-editor with-name="true" submit-label="Create game" @update-game="submit" />
      </div>
    </div>
  </div>
</template>
