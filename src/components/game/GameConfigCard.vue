<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import BrokerPill from '@/components/Broker/BrokerPill.vue';
import ParametersTable from '@/components/parameter/ParametersTable.vue';
import {GameConfig} from '@/domain/Game/GameConfig';

@Component({name: 'game-config-card', components: {BrokerPill, ParametersTable}})
export default class GameConfigCard extends Vue {

  @Prop({required: true})
  private config: GameConfig;

  @Prop({required: false, default: () => null})
  private index: number|null;

}
</script>

<template>
  <div class="game-config-card">
    <div v-if="index !== null">
      {{index}}
    </div>
    <div class="brokers">
      <broker-pill v-for="broker in config.brokers" :broker="broker" :key="broker.id" />
    </div>
    <parameters-table :parameters="config.parameters" />
  </div>
</template>

<style lang="scss" scoped>
div.game-config-card {
  display: flex;
  background: $slate-50;
  border: 1px solid #F1F5F9;

  & > *:last-child {
    flex-grow: 1;
  }

  div.broker-pill {
    background: #fff;
  }

}
</style>
