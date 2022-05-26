<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import {Broker} from '@/domain/Broker/Broker';

@Component({name: 'broker-pill'})
export default class BrokerPill extends Vue {

  @Prop({required: true})
  private broker: Broker;

}
</script>

<template>
  <div class="broker-pill">
    <div class="name">{{broker.name}}</div>
    <div class="version">{{broker.version}}</div>
  </div>
</template>
