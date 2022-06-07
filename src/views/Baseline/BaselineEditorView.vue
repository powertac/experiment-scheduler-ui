<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import BaselineEditor from '@/components/Baseline/BaselineEditor.vue';
import {OrchestratorClient} from '@/api/OrchestratorClient';
import {BaselineConfig} from '@/domain/Baseline/BaselineConfig';

@Component({components: {'baseline-editor': BaselineEditor}})
export default class BaselineEditorView extends Vue {

  private createBaseline(baselineConfig: BaselineConfig): void {
    OrchestratorClient.generateBaseline(baselineConfig)
  }

}
</script>

<template>
  <div class="view">
    <div class="action-bar">
      <a @click="$router.go(-1)">
        <fa-icon class="icon" icon="arrow-left" />
        Back
      </a>
    </div>
    <baseline-editor @update-baseline="createBaseline" />
  </div>
</template>
