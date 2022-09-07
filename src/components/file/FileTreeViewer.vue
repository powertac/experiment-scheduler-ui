<template>
  <div class="file-tree-viewer"  v-on:mousemove="resizeX" v-on:click="stopResizeX" :class="{'unselectable': resizing}">
      <div class="run-navigator" :style="{'width': navigatorWidth + 'px'}" :class="{'unselectable': resizing}">
        <file-node :node="root" :is-root="true" :selected-node="currentFile" :selectable="true" @file-selected="selectFile" />
      </div>
      <div class="resizer" :class="{'active': resizing}"
           v-on:mousedown="startResizeX"
           v-on:mouseup="stopResizeX">
        <div class="resizer-center-line"></div>
      </div>
      <file-viewer :file="currentFile" />
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
import FileNode from '@/domain/File/FileNode';
import FileViewer from '@/components/file/FileViewer.vue';
import FileTreeNode from '@/components/file/FileTreeNode.vue';
import api from '@/api/api';
import MouseMoveEvent = JQuery.MouseMoveEvent;

@Component({name: 'file-tree-viewer', components: {'file-node': FileTreeNode, 'file-viewer': FileViewer}})
export default class FileTreeViewer extends Vue {

  @Prop({required: true})
  private root: FileNode;

  @Prop({required: false, default: () => false})
  private showRoot: boolean;

  private currentFile: FileNode|null;
  private currentFileContent: string|null;
  private resizing: boolean;
  private navigatorWidth: number|null;

  constructor() {
    super();
    this.currentFile = null;
    this.currentFileContent = null;
    this.resizing = false;
    this.navigatorWidth = null;
  }

  @Watch("root")
  private onRootChange(): void {
    this.currentFile = null;
  }

  private selectFile(file: FileNode): void {
    this.currentFile = file;
    if (!file.directory) {
      api.orchestrator.application.fileContents(file)
          .then((content) => this.currentFileContent = content)
          .catch((error) => console.log(error));
    }
  }

  private startResizeX(): void {
    this.resizing = true;
  }

  private resizeX(event: MouseMoveEvent): void {
    if (this.resizing) {
      this.navigatorWidth = Math.round(event.clientX - (<DOMRect> this.$el.getBoundingClientRect()).x) - 5;
    }
  }

  private stopResizeX(): void {
    this.resizing = false;
  }

}
</script>

<style lang="scss" scoped>
.file-tree-viewer {
  display: flex;
  flex-grow: 1;
  overflow: auto;
  &.unselectable {
    -webkit-user-select: none;
  }
}
div.run-navigator {
  display: flex;
  width: 20%;
  overflow: auto;
}
div.resizer {
  display: flex;
  justify-content: center;
  background: transparent;
  width: 11px;
  cursor: ew-resize;
  z-index: 100;
  border: 0 solid transparent;
  margin: 0 -5px;
  &:hover {
    background: rgba(147, 161, 161, .2);
  }
  .resizer-center-line {
    width: 1px;
    align-self: stretch;
    background: #93a1a1;
  }
}
</style>

