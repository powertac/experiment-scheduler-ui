<template>
  <div class="file-node">
    <!--<fa-icon class="icon" :icon="icon" v-if="isRoot" />-->
    <span class="file-name"
          @click="$emit('file-selected', node)">{{isRoot ? '.../' : ''}}{{node.name}}{{ node.directory && !isRoot ? '/' : ''}}</span>
    <file-node class="child" :node="child" v-for="child in node.children" :key="child.path" @file-selected="(file) => $emit('file-selected', file)" />
    <!--<div class="file-actions" v-if="showContextMenu" :style="contextMenuStyle" v-click-outside="() => showContextMenu = false">
      <button type="button">Download {{ node.directory ? 'files' : 'file' }}</button>
      <button type="button">Copy path</button>
    </div>-->
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import FileNode from '@/domain/File/FileNode';
import ClickEvent = JQuery.ClickEvent;

@Component({name: 'file-node'})
export default class FileTreeNodeWithContextMenu extends Vue {

  @Prop({required: true})
  private node: FileNode;

  @Prop({required: false, default: () => false})
  private isRoot: boolean;

  private showContextMenu: boolean;
  private contextMenuX: number;
  private contextMenuY: number;

  constructor() {
    super();
    this.showContextMenu = false;
    this.contextMenuX = 0;
    this.contextMenuY = 0;
  }

  get icon(): string {
    return this.node.directory
        ? 'folder'
        : 'file';
  }

  get path(): string {
    return this.node.path.replace("file://", "");
  }

  get contextMenuStyle(): {[key: string]: string} {
    return {
      top: this.contextMenuY + 'px',
      left: this.contextMenuX + 'px'
    };
  }

  private openContextMenu(event: ClickEvent): void {
    this.contextMenuX = Math.round(event.clientX - (<DOMRect> this.$el.getBoundingClientRect()).x);
    this.contextMenuY = Math.round(event.clientY - (<DOMRect> this.$el.getBoundingClientRect()).y);
    this.showContextMenu = true;
  }

}
</script>

<style lang="scss">
$icon-color: #CBD5E1;
$line-color: #CBD5E1;
$line-style: solid;
.file-node {
  position: relative;
  padding-left: 1rem;
  font-family: "Inconsolata", monospace;
  flex-wrap: nowrap;
  .file-name {
    display: inline-block;
    //padding-left: .15rem;
    line-height: 1.75;
    word-break: keep-all;
    white-space: nowrap;
  }
  &.child {
    margin-left: .45rem;
    border-left: 1px $line-style $line-color;
    &:before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      height: .85rem;
      width: .5rem;
      border-bottom: 1px $line-style $line-color;
    }
    &:last-child {
      border-left: 0;
      padding-left: calc(1rem + 1px);
      &:before {
        border-left: 1px $line-style $line-color;
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

