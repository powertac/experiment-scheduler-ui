<template>
  <div id="game-run-details">
    <h1 class="run-title">{{run.id}}</h1>
    <h2>Files</h2>
    <file-node :node="files" :is-root="true" v-if="files !== null" />
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import {GameRun} from '@/domain/Game/GameRun';
import {OrchestratorClient} from '@/api/OrchestratorClient';
import FileTreeNode from '@/components/file/FileTreeNode.vue';
import {FileNode} from '@/domain/File/FileNode';

@Component({components: {'file-node': FileTreeNode}})
export default class GameRunDetails extends Vue {

  @Prop({required: true})
  private run: GameRun;

  private files: FileNode|null;

  constructor() {
    super();
    this.files = null;
  }

  private mounted(): void {
    OrchestratorClient.runFiles(this.run.id)
        .then((files) => this.files = files)
        .catch((error) => console.log(error));
  }

}
</script>

<style lang="scss" scoped>
#game-run-details {
  display: block;
}
h1.run-title {
 width: 100%;
}
</style>

