<template>
  <div class="run-navigator-item">
    <div class="run-navigator-item-header active">
      <date class="run-date" :date="run.start" />
      <date class="run-date" :date="run.end" />
    </div>
    <file-node :node="files" :is-root="true" v-if="files !== null" />
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import {GameRun} from '@/domain/Game/GameRun';
import {OrchestratorClient} from '@/api/OrchestratorClient';
import FileTreeNode from '@/components/file/FileTreeNode.vue';
import {FileNode} from '@/domain/File/FileNode';
import FormattedDate from '@/components/time/FormattedDate.vue';

@Component({components: {'file-node': FileTreeNode, 'date': FormattedDate}})
export default class GameRunNavigationItem extends Vue {

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
.run-navigator-item {
  position: relative;
}
div.run-navigator-item-header {
  background: #F8FAFC;
  padding: .25rem .75rem;
  border-bottom: 1px solid #E2E8F0;
  position: sticky;
  top: 0;
  left: 0;
  .run-date {
    display: block;
    font-family: "Inconsolata", monospace;
  }
  &.active {
    background: #F0F9FF;
  }
}
</style>

