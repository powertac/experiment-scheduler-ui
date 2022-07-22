<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
import {Broker} from '@/domain/Broker/Broker';

@Component({name: "broker-selector"})
export default class BrokerSelector extends Vue {

  @Prop({required: false, default: () => []})
  private initiallySelected: Broker[];

  @Prop({required: false, default: () => []})
  private brokerSet: Broker[];

  @Prop({required: false, default: () => true})
  private multiSelect: boolean;

  private selected: {[key: string]: Broker|undefined};

  constructor() {
    super();
    this.selected = {};
  }

  private mounted() {
    this.$store.dispatch('brokers/loadAll').then(() => {
      // TODO : add loading indication
    }).catch(() => {
      console.error('failed to load brokers');
    });
    this.initiallySelected.forEach((b) => this.toggleSelect(b));
  }

  @Watch('initiallySelected')
  private updateSet(): void {
    if (this.initiallySelected.length === 0) {
      this.selected = {}
    }
  }

  get brokers(): Broker[] {
    return this.brokerSet.length > 0
        ? this.brokerSet
        : this.$store.getters['brokers/findAll'];
  }

  get enabledBrokers(): Broker[] {
    return this.brokers.filter((b) => b.enabled);
  }

  private toggleSelect(broker: Broker): void {
    if (broker.enabled && broker.id != undefined) {
      const value = this.selected[broker.id] === undefined ? broker : undefined;
      if (!this.multiSelect) {
        Object.keys(this.selected).forEach(key => Vue.set(this.selected, key, undefined));
      }
      Vue.set(this.selected, broker.id, value);
      this.$emit('selected', Object.values(this.selected).filter((b) => b != undefined));
    }
  }

}
</script>

<template>
  <div class="broker-selector">
    <div class="broker"
         :class="{'selected': selected[broker.id] !== undefined, 'disabled': !broker.enabled}"
         v-for="broker in enabledBrokers"
         @click="toggleSelect(broker)">
      <div class="name">
        {{broker.name}}
      </div>
      <div class="version">
        {{broker.version}}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
div.broker-selector {
  display: flex;
  gap: .66rem;
  flex-flow: row wrap;
  background: #F1F5F9;
  padding: .66rem 1rem;
  border-radius: .2rem;
  justify-content: space-between;

  div.broker {
    display: flex;
    min-width: 24%;
    background: #fff;
    cursor: pointer;
    border-radius: .2rem;
    div.name {
      border-top-left-radius: .2rem;
      border-bottom-left-radius: .2rem;
      border: 1px solid #ddd;
      border-right-width: 0;
      flex-grow: 1;
      padding: .5rem 1rem;
    }
    div.version {
      min-width: 33%;
      justify-content: center;
      display: flex;
      align-items: center;
      border-top-right-radius: .2rem;
      border-bottom-right-radius: .2rem;
      padding: 0 1rem;
      //background: #eee;
      color: #555;
      //font-weight: bold;
      text-transform: uppercase;
      font-size: .75em;
      align-self: stretch;
      border: 1px solid #ddd;
      border-left-color: #eee;
    }
    &.disabled {
      background: #fafafa;
      cursor: not-allowed;
      color: #bbb;
      border-color: #ddd;
      div.name, div.version {
        text-decoration: line-through;
        border-color: #ddd;
      }
      div.version {
        color: #bbb;
      }
    }
    &.selected {
      color: #134E4A;
      background: #CCFBF1;
      div.name, div.version {
        border-color: #14B8A6;
        color: #134E4A;
      }
      div.version {
        border-left-color: rgba(20, 173, 89, .33);
      }
    }
  }
}
</style>
