<template>
  <div class="modifier-editor">
    <h1>Modifier</h1>
    <div class="type-selector">
      <h2>Type: broker-replacement</h2>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {TreatmentSpec} from '@/domain/Treatment/Treatment';
import {ReplaceBrokerModifierSpec} from '@/domain/Treatment/ReplaceBrokerModifierSpec';

export default class ModifierEditor extends Vue {

  private spec: TreatmentSpec<ReplaceBrokerModifierSpec>;

  constructor() {
    super();
    this.spec = {};
  }

}
</script>

<style lang="scss" scoped>
</style>
