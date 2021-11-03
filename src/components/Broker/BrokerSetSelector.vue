<template>
  <div class="broker-set-selector">
    <div class="set" v-for="set in Object.keys(sets)">
      <!--<h3>{{set}}</h3>-->
      <div class="brokers">
        <div class="broker-pill" v-for="broker in sets[set]">
          <div class="name">
            {{broker.name}}
          </div>
          <div class="version">
            {{broker.version}}
          </div>
        </div>
      </div>
    </div>
    <select-brokers :initially-selected="currentSet" v-on:selected="updateCurrentSet" />
    <button type="button" class="btn btn-block btn-primary" @click="addCurrentSet">
      Add set
    </button>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {Broker} from '@/domain/Broker/Broker';
import BrokerSelector from '@/components/Broker/BrokerSelector.vue';
import uuid from 'uuid/v4';

@Component({components: {'select-brokers': BrokerSelector}})
export default class BrokerSetSelector extends Vue {

  private currentSet: Broker[];
  private sets: {[key: string]: Broker[]}

  constructor() {
    super();
    this.currentSet = [];
    this.sets = [];
  }

  private updateCurrentSet(brokers: Broker[]): void {
    this.currentSet = brokers;
  }

  private addCurrentSet(): void {
    Vue.set(this.sets, uuid(), this.currentSet)
    this.currentSet = [];
    this.$emit('updated', Object.values(this.sets));
  }

}
</script>

<style scoped lang="scss">
.set {
  background: #fafafa;
  padding: .5rem .5rem 0 .5rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: .2rem;

  .brokers {
    display: flex;
    flex-wrap: wrap;

    .broker-pill {
      background: #fff;
      cursor: default;
    }
  }
}

</style>
