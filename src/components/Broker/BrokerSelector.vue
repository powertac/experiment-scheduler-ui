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

<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
import {Broker} from '@/domain/Broker/Broker';

@Component
export default class BrokerSelector extends Vue {

  @Prop({required: false, default: () => []})
  private initiallySelected: Broker[];

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
    return this.$store.getters['brokers/findAll'];
  }

  get enabledBrokers(): Broker[] {
    return this.brokers.filter((b) => b.enabled);
  }

  private toggleSelect(broker: Broker): void {
    if (broker.enabled && broker.id != undefined) {
      const value = this.selected[broker.id] === undefined ? broker : undefined;
      Vue.set(this.selected, broker.id, value);
      this.$emit('selected', Object.values(this.selected).filter((b) => b != undefined));
    }
  }

}
</script>

<style scoped lang="scss">
div.broker-selector {
  display: flex;
  margin-left: -.5rem;
  margin-right: -.5rem;
  flex-flow: row wrap;
  justify-content: center;

  div.broker {
    display: flex;
    width: 31%;
    margin: 0 .5rem .5rem .5rem;
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
      color: #000aa3;
      background: #F2F5FF;
      //box-shadow: 0 0 0 .15rem rgba(0,123,255,.25);
      div.name, div.version {
        border-color: #A5B3E8;
        color: #000aa3;
      }
      div.version {
        border-left-color: rgba(165, 179, 232, .5);
      }
    }
  }
}
</style>
