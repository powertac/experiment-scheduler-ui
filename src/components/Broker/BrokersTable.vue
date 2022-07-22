<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import {Broker} from '@/domain/Broker/Broker';

@Component({name: 'parameters-table'})
export default class BrokersTable extends Vue {

  @Prop({required: true})
  private brokers: Broker[];

}
</script>

<template>
  <table class="key-value">
    <thead>
    <tr>
      <th>Broker</th>
      <th>Version</th>
      <th>Image</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="broker in brokers" :key="broker.id">
      <td class="semibold">{{broker.name}}</td>
      <td>{{broker.version}}</td>
      <td class="mono">{{broker.imageTag}}</td>
    </tr>
    <tr v-if="brokers.length < 1">
      <td colspan="3" class="text-center no-data-text">No brokers configured</td>
    </tr>
    </tbody>
  </table>
</template>

<style lang="scss">
</style>
