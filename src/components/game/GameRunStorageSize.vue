<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import {GameRun} from '@/domain/Game/GameRun';
import GameClient from '@/api/GameClient';
import Files from '@/util/Files';

@Component
export default class FormattedFileSize extends Vue {

  @Prop({required: true})
  private run: GameRun;

  private bytes: number|null;

  constructor() {
    super();
    this.bytes = null;
  }

  private mounted(): void {
    GameClient.gameRunBytes(this.run.id)
        .then((bytes) => this.bytes = bytes)
        .catch((error) => console.error("could not load run storage size", error));
  }

  get formattedRunBytes(): string {
    return Files.formatBytes(this.bytes);
  }

}
</script>

<template>
  <span v-html="formattedRunBytes"></span>
</template>
