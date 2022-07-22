<template>
  <div class="file-node">
    <span class="file-name" :class="{'selectable': selectable && !node.directory, 'selected': selected}" @click="selectSelf">
      {{isRoot ? '.../' : ''}}{{node.name}}{{ node.directory && !isRoot ? '/' : ''}}
    </span>
    <file-node class="child" :node="child" v-for="child in node.children" :key="child.path"
               :selected-node="selectedNode"
               :selectable="selectable"
               @file-selected="selectFile" />
  </div>
</template>

<script lang="ts">
import {Component, Emit, Prop, Vue} from 'vue-property-decorator';
import FileNode from '@/domain/File/FileNode';

@Component({name: 'file-node'})
export default class FileTreeNode extends Vue {

  @Prop({required: true})
  private node: FileNode;

  @Prop({required: false, default: () => null})
  private selectedNode: FileNode|null;

  @Prop({required: false, default: () => false})
  private isRoot: boolean;

  @Prop({required: false, default: () => false})
  private selectable: boolean;

  get path(): string {
    return this.node.path.replace("file://", "");
  }

  get selected(): boolean {
    return this.selectedNode !== null
        ? this.node.path === this.selectedNode.path
        : false;
  }

  private selectSelf(): void {
    if (!this.node.directory) {
      this.selectFile(this.node);
    }
  }

  @Emit('file-selected')
  private selectFile(file: FileNode): FileNode|null {
    return this.selectable ? file : null;
  }

}
</script>

<style lang="scss" scoped>
$icon-color: #CBD5E1;
$line-color: #CBD5E1;
$line-style: solid;
$line-width: 1px;
.file-node {
  position: relative;
  padding-left: .75rem;
  font-family: "Inconsolata", monospace;
  flex-wrap: nowrap;
  .file-name {
    display: inline-block;
    line-height: 1.75;
    word-break: keep-all;
    white-space: nowrap;
    color: #475569;
    padding-left: .4rem;
    padding-right: .4rem;
    &.selectable {
      cursor: pointer;
      color: #1E293B;
    }
    &.selected {
      color: #0F172A;
      background: #F1F5F9;
      border-radius: .2rem;
    }
  }
  &.child {
    margin-left: .66rem;
    border-left: $line-width $line-style $line-color;
    &:before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      height: .85rem;
      width: .66rem;
      border-bottom: $line-width $line-style $line-color;
    }
    &:last-child {
      border-left: 0;
      padding-left: calc(.75rem + 1px);
      &:before {
        border-left: $line-width $line-style $line-color;
      }
    }
  }
}
.icon {
  margin-right: .33rem;
  color: $icon-color;
}
.file-actions {
  position: absolute;
  background: #fff;
  padding: 1rem;
  border-radius: .2rem;
  border: 1px solid #94A3B8;
  z-index: 100;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
}
</style>

