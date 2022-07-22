<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import BaselineEditor from '@/components/Baseline/BaselineEditor.vue';
import {OrchestratorClient} from '@/api/OrchestratorClient';
import {BaselineConfig} from '@/domain/Baseline/BaselineConfig';
import ViewActionBar from '@/components/application/ViewActionBar.vue';

@Component({components: {'baseline-editor': BaselineEditor, ViewActionBar}})
export default class BaselineEditorView extends Vue {

  private createBaseline(baselineConfig: BaselineConfig): void {
    OrchestratorClient.generateBaseline(baselineConfig)
        .then(() => this.$router.push("/baselines/"))
        .catch((error) => console.error(error))
  }

}
</script>

<template>
  <div>
    <view-action-bar />
    <div class="view-content scrollable">
      <div class="container">
        <h1 class="editor-title">New Baseline</h1>
        <baseline-editor @update-baseline="createBaseline" />
      </div>
    </div>
  </div>
</template>
