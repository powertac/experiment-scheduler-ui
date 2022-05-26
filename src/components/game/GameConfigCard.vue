<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import {GameSpec} from '@/domain/Game/GameSpec';
import BrokerPill from '@/components/Broker/BrokerPill.vue';
import ParametersTable from '@/components/parameter/ParametersTable.vue';

@Component({name: 'game-config-card', components: {BrokerPill, ParametersTable}})
export default class GameConfigCard extends Vue {

  @Prop({required: true})
  private config: GameSpec;

}
</script>

<template>
  <div class="game-config-card">
    <div v-if="config.name.length > 0">{{config.name}}</div>
    <div class="brokers">
      <broker-pill v-for="broker in config.brokers" :broker="broker" :key="broker.id" />
    </div>
    <parameters-table :parameters="config.serverParameters" />
  </div>
</template>

<style lang="scss" scoped>
div.game-config-card {
  background: $slate-50;
  border: 1px solid #F1F5F9;
}
</style>
