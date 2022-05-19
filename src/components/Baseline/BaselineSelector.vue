<template>
  <div class="game-selector">
    <autocomplete :items="baselineList"
                  :initial-value="initialName"
                  @item-selected="selectBaseline($event)"
                  @item-changed="selectBaseline($event)" />
  </div>
</template>

<script lang="ts">
import {Component, Emit, Prop, Vue} from 'vue-property-decorator';
import Autocomplete from '@/components/form/Autocomplete.vue';
import {Baseline} from '@/domain/Baseline/Baseline';

@Component({name: 'baseline-selector', components: {Autocomplete}})
export default class BaselineSelector extends Vue {

  @Prop({required: false, default: () => () => true})
  private filter: (baseline: Baseline) => boolean

  @Prop({required: false, default: null})
  private initialValue: Baseline|null

  get initialName(): string {
    return null != this.initialValue
        ? this.baselineLabel(this.initialValue)
        : '';
  }

  get baselineList(): string[] {
    return this.$store.getters['baselines/findAll']
        .sort((a: Baseline, b: Baseline) => b.createdAt - a.createdAt)
        .filter(this.filter)
        .map(this.baselineLabel);
  }

  @Emit('baseline-selected')
  private selectBaseline(label: string): Baseline | null {
    const baselines = this.$store.getters['baselines/findAll']
    for (const index in baselines) {
      if (this.baselineLabel(baselines[index]) == label) {
        return baselines[index]
      }
    }
    return null
  }

  private baselineLabel(baseline: Baseline): string {
    return `@${baseline.id} - ${baseline.name}`;
  }

}
</script>

<style scoped lang="scss">
</style>
