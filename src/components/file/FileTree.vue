<template>
  <div id="game-run-details">

  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import Duration from '@/components/time/Duration.vue';
import {GameRun} from '@/domain/Game/GameRun';
import {OrchestratorClient} from '@/api/OrchestratorClient';
import {FileNode} from '@/domain/File/FileNode';

@Component({components: {duration: Duration}})
export default class FileNode extends Vue {

  @Prop({required: true})
  private root: FileNode;

}
</script>

<style lang="scss" scoped>
</style>

