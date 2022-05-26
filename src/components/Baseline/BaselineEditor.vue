<script lang="ts">
import {Component, Emit, Vue} from 'vue-property-decorator';
import GameConfigEditor from '@/components/game/GameConfigEditor.vue';
import {GameSpec} from '@/domain/Game/GameSpec';
import {GameMultiplierBaselineGenerator} from '@/domain/Baseline/GameMultiplierBaseline';
import {BaselineConfig} from '@/domain/Baseline/BaselineConfig';
import GameConfigCard from '@/components/game/GameConfigCard.vue';

@Component({components: {'game-editor': GameConfigEditor, GameConfigCard}})
export default class BaselineEditor extends Vue {

  private name: string;
  private gameConfigs: GameSpec[]
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

  private addGameConfig(config: GameSpec): void {
    this.gameConfigs.push(config);
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
  <form id="game-form" @submit="updateBaseline">
    <h1>Baseline</h1>
    <div>
      <label for="baseline-name">Name</label>
      <input type="text" id="baseline-name" class="text-input" v-model="name" />
    </div>
    <div>
      <label for="baseline-multiplier">Multiplier</label>
      <input type="number" id="baseline-multiplier" class="text-input" v-model="multiplier" />
    </div>
    <div>
      <game-editor @update-game-spec="addGameConfig" />
      <game-config-card v-for="config in gameConfigs" :config="config" />
    </div>
    <div>
      <button type="submit" :disabled="!baselineConfig.isValid">Submit</button>
    </div>
  </form>
</template>

<style lang="scss" scoped>
</style>
