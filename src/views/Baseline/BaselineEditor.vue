<template>
  <div class="treatment-editor">
    <div class="action-bar">
      <a @click="$router.go(-1)">
        <fa-icon class="icon" icon="arrow-left" />
        Back
      </a>
    </div>
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-7 col-xl-5 offset-md-2">
          <form id="treatment-form" @submit="createBaseline()">
            <h1>New treatment</h1>
            <div class="input-block">
              <h5>Baseline</h5>
              <baseline-selector @baseline-selected="selectedBaseline = $event" />
            </div>
            <div class="input-block">
              <h5>Name</h5>
              <input type="text" class="text-input" v-model="name" />
            </div>
            <div class="input-block">
              <h5>Modifier</h5>
              <div class="treatment-type-selector">
                <div class="treatment-type-option"
                     @click="type = 'replace-broker'"
                     :class="{'selected': type === 'replace-broker'}">
                  <h5>Broker replacement</h5>
                  <p>A broker from one or more of the baseline's broker sets will be replaced by another broker.</p>
                </div>
                <div class="treatment-type-option"
                     @click="type = 'parameter-set'"
                     :class="{'selected': type === 'parameter-set'}">
                  <h5>Parameter set</h5>
                  <p>One or more server parameters will be set to the provided values.</p>
                </div>
              </div>
            </div>
            <hr>
            <template v-if="selectedBaseline !== null">
              <div v-if="type === 'replace-broker'">
                <h3>Modifier: Broker replacement</h3>
                <div class="input-block" v-if="selectedBaseline !== null">
                  <h5>Original broker</h5>
                  <broker-selector :broker-set="originalBrokers" :multi-select="false" v-on:selected="setOriginal" />
                </div>
                <div class="input-block" v-if="original !== null">
                  <h5>Replacement</h5>
                  <broker-selector :multi-select="false" v-on:selected="setReplacement" />
                </div>
              </div>
              <div v-else-if="type === 'parameter-set'">
                <h3>Modifier: Parameter set</h3>
                <parameter-set @parameters-updated="setParameters" />
              </div>
              <p class="text-center text-muted" v-else>
                <em>Select a baseline and a modifier to proceed...</em>
              </p>
            </template>
            <p class="text-center text-muted" v-else>
              <em>Select a baseline and a modifier to proceed...</em>
            </p>
            <hr>
            <div class="form-actions text-right">
              <button type="submit" class="button" :class="{'disabled': !isValidTreatment}" :disabled="!isValidTreatment">
                Create treatment
                <fa-icon class="button-icon" icon="check" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Baseline} from '@/domain/Baseline/Baseline';
import {Broker} from '@/domain/Broker/Broker';
import {VueAdapter} from '@/VueAdapter';
import Component from 'vue-class-component';
import {BrokerSet} from '@/domain/Broker/BrokerSet';
import {TreatmentSpec} from '@/domain/Treatment/Treatment';
import {ReplaceBrokerModifierSpec} from '@/domain/Treatment/ReplaceBrokerModifier';
import BaselineSelector from '@/components/Baseline/BaselineSelector.vue';
import {ParameterSetModifierSpec} from '@/domain/Treatment/ParameterSetModifier';
import {ModifierSpec} from '@/domain/Treatment/Modifier';
import BrokerSelector from '@/components/Broker/BrokerSelector.vue';
import ParameterInput from '@/components/form/ParameterInput.vue';
import ParameterSetInput from '@/components/ParameterSetInput.vue';
import api from '@/api/api';

@Component({components: {'parameter-set': ParameterSetInput, BaselineSelector, BrokerSelector, ParameterInput}})
export default class TreatmentEditor extends VueAdapter {

  private name: string;
  private type: string;
  private selectedBaseline: Baseline|null;
  private original: Broker|null;
  private replacement: Broker|null;
  private parameters: {[key: string]: string};

  constructor() {
    super();
    this.name = '';
    this.type = '';
    this.selectedBaseline = null;
    this.original = null;
    this.replacement = null;
    this.parameters = {};
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

  get isValidTreatment(): boolean {
    return this.name.length > 3
        && null !== this.selectedBaseline
        && null !== this.modifierSpec;
  }

  get modifierSpec(): ModifierSpec|null {
    if (this.selectedBaseline !== null) {
      if (this.type === 'replace-broker') {
        return (null !== this.original && null !== this.replacement)
            ? <ReplaceBrokerModifierSpec> {
              type: "replace-broker",
              name: this.name,
              original: this.original,
              replacement: this.replacement
            }
            : null;
      } else if (this.type === 'parameter-set') {
        // TODO : return null if parameter set empty
        return <ParameterSetModifierSpec> {
          type: "parameter-set",
          name: this.name,
          parameters: this.parameters
        }
      }
    }
    return null;
  }

  private setOriginal(brokers: Broker[]): void {
    this.original = brokers.length === 1
        ? <Broker> brokers.shift()
        : null;
  }

  private setReplacement(brokers: Broker[]): void {
    this.replacement = brokers.length === 1
        ? <Broker> brokers.shift()
        : null;
  }

  private setParameters(parameters: {[key: string]: string}): void {
    this.parameters = parameters;
  }

  get spec(): TreatmentSpec<any>|null {
    return this.isValidTreatment
        ? {
          name: this.name,
          baselineId: (<Baseline> this.selectedBaseline).id,
          modifier: this.modifierSpec
        }
        : null;
  }

  private createTreatment(): void {
    const spec = this.spec;
    if (null !== spec) {
      api.orchestrator.treatments.create(spec)
          .then(() => this.$router.push('/treatments'))
          .catch(error => console.error(error));
    } else {
      console.error("invalid treatment spec");
    }
  }

}
</script>

<style lang="scss" scoped>
#treatment-form {
  margin-top: 3rem;

  input.text-input {
    width: 100%;
    border: 1px solid #ccc;
    padding: .5em 1em .6em 1em;
    outline: none;
    color: #444;
    &:focus {
      border-color: #80bdff;
      color: #222;
    }
  }

  div.input-block {
    padding-top: 1.25rem;
    h5 {
      margin-bottom: .66rem;
    }
  }

  div.treatment-type-selector {
    display: flex;
    width: 100%;
    gap: 1rem;

    div.treatment-type-option {
      border: 1px solid #ddd;
      padding: .875rem 1rem .875rem 1rem;
      border-radius: .2rem;
      cursor: pointer;
      &.selected {
        border: 1px solid #A5B3E8;
        color: #000aa3;
        background: #F2F5FF;
      }
      p {
        margin-bottom: 0;
      }
    }
  }

}
</style>
