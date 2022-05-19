<template>
  <div class="file-viewer">
    <div class="file-header">
      {{file !== null ? file.path : ''}}
    </div>
    <div class="file-contents">
      <div class="no-file-placeholder" v-if="file === null">
        Select a file to show its contents.
      </div>
      <div class="file-loading" v-else-if="lines.length < 1">
        <fa-icon icon="circle-notch" spin />
      </div>
      <table class="file-content" v-else>
        <tr v-for="(line, index) in lines" :key="index">
          <th>
            {{index}}
          </th>
          <td><pre v-html="line"></pre></td>
        </tr>
      </table>
      <div class="filler"></div>
    </div>
    <div class="file-footer">
      Showing {{lines.length}} lines
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
import FileNode from '@/domain/File/FileNode';
import {OrchestratorClient} from '@/api/OrchestratorClient';

@Component
export default class FileViewer extends Vue {

  @Prop({required: true})
  private file: FileNode|null;

  content: string|null;

  constructor() {
    super();
    this.content = null;
  }

  get lines(): string[] {
    return null !== this.content
        ? this.content.split(/\r\n|\r|\n/)
        : [];
  }

  @Watch("file")
  private onFileChange(file: FileNode|null): void {
    this.content = null;
    if (null != file) {
      if (!file.directory) {
        OrchestratorClient.fileContent(file)
            .then((content) => this.content = content)
            .catch((error) => console.log(error));
      }
    }
  }

}
</script>

<style lang="scss" scoped>
.file-viewer {
  display: flex;
  flex-grow: 1;
  overflow: auto;
  width: 0;
  flex-direction: column;
  &.unselectable {
    -webkit-user-select: none;
  }
}
div.file-header, div.file-footer {
  background: #F5F5F4;
  padding: .5rem 1rem;
}
div.file-header {
  font-family: "Inconsolata", monospace;
  border-bottom: 1px solid #D6D3D1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 2.6rem;
}
div.file-footer {
  border-top: 1px solid #D6D3D1;
}
div.file-contents {
  display: flex;
  flex-direction: column;
  align-self: stretch;
  flex-grow: 1;
  overflow: auto;
  background: #fdf6e3;
}
div.filler {
  flex-grow: 1;
}
table {
  font-size: 14px;
  font-family: "Inconsolata", monospace;
  background: #fdf6e3;
  margin: 0;
  padding: 1rem;
  color: #657b83;
  line-height: 1.33;
  overflow-y: scroll;
  width: 100%;
  position: relative;
  border-bottom: 1px solid #eee8d5;
  th {
    position: sticky;
    left: 0;
    background: #eee8d5;
    font-weight: normal;
    -webkit-user-select: none;
    text-align: right;
    padding: .1rem 1rem;
  }
  td {
    padding: .1rem 1rem;
    pre {
      padding: 0;
      margin: 0;
      color: #657b83;
    }
  }
  tr:hover {
    td {

    }
  }
}
div.no-file-placeholder, div.file-loading {
  display: flex;
  flex-grow: 1;
  height: 100%;
  justify-content: center;
  align-items: center;
  background: #FAFAF9; // stone 50
  color: #475569;
}
div.file-loading {
  font-size: 2rem;
}
</style>
