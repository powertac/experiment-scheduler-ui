<template>
  <div class="embedded-game-form">
    <div class="form embedded">
      <div class="field-group">
        <label for="game-name" class="field-group-title le">Name</label>
        <div class="field-group-body">
          <input type="text" v-model="name" class="form-control" id="game-name">
        </div>
      </div>
      <div class="field-group">
        <h5 class="field-group-title">Server Parameters</h5>
        <div class="field-group-body">
          <parameter v-for="param in serverParameters" :key="param.id"
                     :allowedParameters="allowedParameters"
                     :enableRemove="isParameterRemovable(param)"
                     @param-updated="updateParam(param, $event)"
                     @param-removed="removeParam(param)" />
        </div>
      </div>
      <div class="field-group">
        <h5 class="field-group-title">Brokers</h5>
        <div class="field-group-body">
          <broker-selector :types="availableTypes"
                           :callback="setBrokers"/>
        </div>
      </div>
      <div class="field-group alternative-actions">
        <div class="field-group-body">
          <div class="control-button" @click="closeForm">
            <div class="control-button-icon">
              <fa-icon icon="times" />
            </div>
            <div class="control-button-text">
              Cancel
            </div>
          </div>
          <div class="alternative-actions-separator">
            OR
          </div>
          <div class="control-button confirm"
               :class="{disabled: !isValid}"
               @click="submit">
            <div class="control-button-icon">
              <fa-icon icon="check" />
            </div>
            <div class="control-button-text">
              {{formSubmitLabel}}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
import {Parameter, TransientParameter} from '@/domain/types/Parameter';
import uuid from 'uuid/v4';
import {RestClient} from '@/api/RestClient';
import ParameterInput from '@/components/form/ParameterInput.vue';
import {Broker, BrokerType} from '@/domain/types/Broker';
import BrokerSelector from '@/components/BrokerSelector.vue';
import {BrokerSpec} from '@/domain/Broker/BrokerSpec';
import {StompClient} from "@/api/StompClient";
import {JobRequest} from "@/domain/types/Job";

@Component({components: {'broker-selector': BrokerSelector, 'parameter': ParameterInput}})
export default class EmbeddedGameForm extends Vue {

  @Prop({required: false, default: 'New Game'})
  private formTitle: string;

  @Prop({required: false, default: 'Queue game'})
  private formSubmitLabel: string;

  @Prop({required: false, default: true})
  private withName: boolean;

  @Prop({required: false, default: false})
  private isEmbedded: boolean;

  private name: string;
  private serverParameters: TransientParameter[];
  private brokers: Broker[];
  private allowedParameters: string[];

  constructor() {
    super();
    this.name = "";
    this.$set(this, 'serverParameters', []);
    this.brokers = [];
    this.allowedParameters = [];
  }

  private created(): void {
    this.serverParameters.push({
      id: uuid(),
      key: '',
      value: '',
    });
    this.$store.dispatch('brokers/refresh');
    RestClient.supportedParams()
        .then((params) => this.allowedParameters = params.sort())
        .catch((e) => console.log(e));
  }

  private updateParam(oldParam: TransientParameter, newParam: TransientParameter): void {
    newParam.id = oldParam.id;
    this.$set(this.serverParameters, this.serverParameters.indexOf(oldParam), newParam);
  }

  private removeParam(param: TransientParameter): void {
    this.$delete(this.serverParameters, this.serverParameters.indexOf(param));
  }

  private isParameterRemovable(param: TransientParameter): boolean {
    return this.serverParameters.length > 1 && !(
        this.serverParameters.indexOf(param) === (this.serverParameters.length - 1)
        && param.key === ''
        && param.value === '');
  }

  @Watch('serverParameters')
  private onServerParametersChanged(params: TransientParameter[]): void {
    if (params.filter((param) => param.key === '' && param.value === '').length < 1) {
      this.serverParameters.push({
        id: uuid(),
        key: '',
        value: '',
      });
    }
  }

  get availableTypes(): BrokerType[] {
    return this.$store.getters['brokers/types'];
  }

  get isValid(): boolean {
    if (this.withName && this.name === '') {
      return false;
    }
    if (this.brokers.length < 1) {
      return false;
    }
    return true;
  }

  private setBrokers(brokers: Broker[]): void {
    this.brokers = brokers;
  }

  private removeBroker(broker: Broker): void {
    this.$delete(this.brokers, this.brokers.indexOf(broker));
  }

  private submit(): void {
    if (!this.isValid) {
      return;
    }
    let brokerSpecs: BrokerSpec[] = this.brokers.map((broker) => {
      return {
        name: broker.name,
        version: 'latest'
      }
    });
    const parameters: Parameter[] = [];
    this.serverParameters
        .filter((param) => param.key !== '')
        .filter((param) => param.value !== '')
        .forEach((param) => parameters.push({key: param.key, value: param.value}));
    this.$emit('form:submit', {
      name: this.name,
      brokers: brokerSpecs,
      serverParameters: parameters
    });
  }

  private closeForm() {
    this.$emit('form:close');
  }

}
</script>

<style lang="scss" scoped>
.embedded-game-form {
  background: #fafafa;
  border: 1px solid #e9e9e9;
  border-radius: .2rem;
}
</style>
