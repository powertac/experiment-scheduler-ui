<script lang="ts">
import {Component, Emit, Vue} from 'vue-property-decorator';
import GameEditor from '@/components/game/GameEditor.vue';
import {GameMultiplierBaselineGenerator} from '@/domain/Baseline/GameMultiplierBaseline';
import {BaselineConfig} from '@/domain/Baseline/BaselineConfig';
import GameConfigCard from '@/components/game/GameConfigCard.vue';
import {GameConfig} from '@/domain/Game/GameConfig';

@Component({components: {'game-editor': GameEditor, GameConfigCard}})
export default class BaselineEditor extends Vue {

  private name: string;
  private gameConfigs: GameConfig[]
  private multiplier: number;

  constructor() {
    super();
    this.name = "";
    this.gameConfigs = [];
    this.multiplier = 0;
  }

  get generator(): GameMultiplierBaselineGenerator {
    return  new GameMultiplierBaselineGenerator(this.gameConfigs, this.multiplier);
  }

  get baselineConfig(): BaselineConfig {
    return new BaselineConfig(this.name, this.generator);
  }

  private addGameConfig(config: GameConfig|null): void {
    if (null !== config) {
      this.gameConfigs.push(config);
    }
  }

  @Emit("update-baseline")
  private updateBaseline(): BaselineConfig|null {
    const config = this.baselineConfig;
    if (config.isValid) {
      return config;
    } else {
      console.error("invalid baseline config");
      return null;
    }
  }

}
</script>

<template>
  <form>
    <div class="editor-block">
      <h2><label for="baseline-name">Name</label></h2>
      <input type="text" id="baseline-name" class="text-input w-full" v-model="name" />
    </div>
    <div class="editor-block">
      <h2><label for="baseline-multiplier">Multiplier</label></h2>
      <input type="number" id="baseline-multiplier" class="text-input text-center" v-model="multiplier" />
    </div>
    <div class="editor-block">
      <game-editor @update-game="addGameConfig" submit-label="Set game config" v-if="gameConfigs.length < 1" />
      <game-config-card v-for="(config, index) in gameConfigs" :config="config" :index="index + 1" :key="index" />
    </div>
    <div>
      <button class="button editor-submit" type="button" :disabled="!baselineConfig.isValid" @click="updateBaseline">Submit</button>
    </div>
  </form>
</template>

<style lang="scss" scoped>
h2 > label {
  margin-bottom: 0;
}
</style>
