<template>
  <div class="treatment-editor">
    <h1>Treatment</h1>
    <form @submit="createTreatment()">
      <h2>Name</h2>
      <input type="text" v-model="name" />
      <h2>Baseline</h2>
      <ul>
        <li v-for="baseline in baselines" :key="baseline.id" @click="selectedBaseline = baseline">
          {{baseline.name}}
          <strong v-if="selectedBaseline === baseline">(Selected)</strong>
        </li>
      </ul>
      <div class="original" v-if="selectedBaseline !== null">
        <h2>Original broker</h2>
        <ul>
          <li v-for="broker in originalBrokers" :key="broker.id" @click="original = broker">
            {{broker.name}} - {{broker.version}}
            <strong v-if="original === broker">(Selected)</strong>
          </li>
        </ul>
      </div>
      <div class="replacement" v-if="original !== null">
        <h2>Replacement</h2>
        <ul>
          <li v-for="broker in allBrokers" :key="broker.id" @click="replacement = broker">
            {{broker.name}} - {{broker.version}}
            <strong v-if="replacement === broker">(Selected)</strong>
          </li>
        </ul>
      </div>
      <button type="submit">
        Add this thing!
      </button>
    </form>
  </div>
</template>

<script lang="ts">
import {Baseline} from '@/domain/Baseline/Baseline';
import {Broker} from '@/domain/Broker/Broker';
import {VueAdapter} from '@/VueAdapter';
import Component from 'vue-class-component';
import {BrokerSet} from '@/domain/Broker/BrokerSet';
import {OrchestratorClient} from '@/api/OrchestratorClient';
import {TreatmentSpec} from '@/domain/Treatment/Treatment';
import {ReplaceBrokerModifierSpec} from '@/domain/Treatment/ReplaceBrokerModifierSpec';

@Component
export default class TreatmentEditor extends VueAdapter {

  private name: string;
  private selectedBaseline: Baseline|null;
  private original: Broker|null;
  private replacement: Broker|null;

  constructor() {
    super();
    this.name = "";
    this.selectedBaseline = null;
    this.original = null;
    this.replacement = null;
  }

  private mounted(): void {
    this.$store.dispatch('baselines/loadAll');
    this.$store.dispatch('brokers/loadAll');
  }

  get baselines(): Baseline[] {
    return this.$store.getters['baselines/findAll'];
  }

  get originalBrokers(): Broker[] {
    return this.selectedBaseline !== null
        ? Object.values(this.selectedBaseline.brokerSets.slice()
            .reduce((complete: {[key:string]: Broker}, set: BrokerSet) => {
              set.brokers.forEach(broker => complete[broker.id !== undefined ? broker.id : ''] = broker);
              return complete;
            }, {}))
        : [];
  }

  get allBrokers(): Broker[] {
    return this.$store.getters['brokers/findAll'];
  }

  get spec(): Promise<TreatmentSpec<any>> {
    return new Promise<TreatmentSpec<any>>((resolve, reject) => {
      try {
        if (this.name.length < 1) {
          // TODO : add more detailed name validation
          return reject(new Error("no name given"));
        }
        if (null === this.selectedBaseline) {
          return reject(Error("no baseline selected"));
        }
        if (null === this.original) {
          return reject(Error("no original broker selected"));
        }
        if (null === this.replacement) {
          return reject(Error("no replacement selected"));
        }
        const modifier: ReplaceBrokerModifierSpec = {
          type: "replace-broker",
          name: this.name,
          original: this.original,
          replacement: this.replacement
        }
        resolve({
          name: this.name,
          baselineId: this.selectedBaseline.id,
          modifier
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  private createTreatment(): void {
    this.spec.then(spec => {
      console.log(spec)
      OrchestratorClient.createTreatment(spec)
          .then(() => console.log("IT WORKED!"))
          .catch(error => console.error(error));
      }).catch(error => console.log(error));
  }

}
</script>

<style lang="scss" scoped>
</style>
