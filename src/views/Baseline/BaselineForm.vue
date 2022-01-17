<template>
  <div id="baseline-form" class="form view">
    <div class="action-bar">
      <button type="button" @click="$router.back()">
        <fa-icon icon="arrow-left" class="icon-left" />
        Back
      </button>
    </div>
    <div class="form-container">
      <h2 class="form-title">New Baseline</h2>
      <div class="field-group">
        <label for="game-name" class="field-group-title le">Name</label>
        <div class="field-group-body">
          <input type="text" v-model="name" class="form-control" id="game-name">
        </div>
      </div>
      <div class="field-group">
        <label for="game-name" class="field-group-title le">Common properties</label>
        <div class="field-group-body">
          <parameter v-for="param in serverParameters" :key="param.id"
                     :initial-key="param.key"
                     :initial-value="param.value"
                     :allowedParameters="supportedParameters"
                     :enableRemove="isParameterRemovable(param)"
                     @param-updated="updateParam(param, $event)"
                     @param-removed="removeParam(param)" />
        </div>
      </div>
      <div class="field-group">
        <label for="game-name" class="field-group-title le">Broker sets</label>
        <div class="field-group-body">
          <broker-set v-on:updated="updateBrokerSets" />
        </div>
      </div>
      <div class="field-group">
        <label for="game-name" class="field-group-title le">Weather</label>
        <div class="field-group-body body-center">
          <weather class="mb-3" v-on:submit="addWeatherConfig" />
          <div class="weather-config" v-for="config in weatherConfigs">
            <div class="location-pill">
              <div class="name text-capitalize">
                {{config.location.name}}
              </div>
              <div class="time-range">
                {{config.startMoment.format('L')}}
              </div>
            </div>
          </div>
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
              Create baseline
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Vue, Watch} from 'vue-property-decorator';
import ParameterInput from '@/components/form/ParameterInput.vue';
import {TransientParameter} from '@/domain/types/Parameter';
import uuid from 'uuid/v4';
import BrokerSetSelector from '@/components/Broker/BrokerSetSelector.vue';
import {Broker} from '@/domain/Broker/Broker';
import {WeatherLocation} from '@/domain/Location/WeatherLocation';
import WeatherSelector from '@/components/form/WeatherSelector.vue';
import {WeatherConfiguration} from '@/domain/Weather/WeatherConfiguration';
import {BaselineData} from '@/domain/Baseline/BaselineData';
import {BaselineSpec} from '@/domain/Baseline/BaselineSpec';
import {OrchestratorClient} from '@/api/OrchestratorClient';

@Component({components: {'parameter': ParameterInput, 'broker-set': BrokerSetSelector, 'weather': WeatherSelector}})
export default class BaselineForm extends Vue {

  private name: string;
  private commonParameters: {[key: string]: string}
  private serverParameters: TransientParameter[];
  private brokerSets: Broker[][];
  private weatherConfigs: WeatherConfiguration[];

  constructor() {
    super();
    this.name = '';
    this.commonParameters = {};
    this.serverParameters = [];
    this.brokerSets = [];
    this.weatherConfigs = [];
  }

  private created(): void {
    this.$store.dispatch('loadSupportedParameters').then().catch();
    this.serverParameters.push({id: uuid(), key: '', value: ''});
  }

  get isValid(): boolean {
    return this.name.length > 3
        && this.brokerSets.length > 0
        && this.weatherConfigs.length > 0;
  }

  get supportedParameters(): string[] {
    return this.$store.getters['supportedParameters'];
  }

  get spec(): BaselineSpec {
    this.serverParameters
        .filter((param) => param.key !== '')
        .filter((param) => param.value !== '')
        .forEach((param) => this.commonParameters[param.key] = param.value);
    const brokerSets = this.brokerSets.map((set) => { return {brokers: set} });
    const weatherConfigs = this.weatherConfigs.map(config => { return {
      location: config.location.name,
      startTime: config.startDate}});
    return {
      name: this.name,
      commonParameters: this.commonParameters,
      brokerSets,
      weatherConfigurations: weatherConfigs
    }
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

  private updateBrokerSets(sets: Broker[][]): void {
    this.brokerSets = sets;
  }

  private addWeatherConfig(config: WeatherConfiguration): void {
    this.weatherConfigs.push(config);
  }

  private closeForm(): void {
    this.$router.back();
  }

  private submit(): void {
    if (this.isValid) {
      OrchestratorClient.createBaseline(this.spec)
          .then(() => this.$router.back())
          .catch(e => console.error(e));
    } else {
      console.error("cannot create new baseline due to insufficient data");
    }
  }

}
</script>

<style lang="scss" scoped>
  .action-bar {
    background: #fafafa;
  }
  div.location-pill {
    margin-left: 15%;
    width: 66%;
    display: flex;
    margin-bottom: .5rem;
    border-radius: .2rem;

    div.name {
      border-top-left-radius: .2rem;
      border-bottom-left-radius: .2rem;
      border: 1px solid #ddd;
      border-right-width: 0;
      flex-grow: 1;
      padding: .5rem 1rem;
    }

    div.time-range {
      text-transform: uppercase;
      min-width: 33%;
      display: flex;
      align-items: center;
      justify-content: center;
      border-top-right-radius: .2rem;
      border-bottom-right-radius: .2rem;
      border: 1px solid #ddd;
      padding: .5rem 1rem;
      font-size: .875em;

      .arrow-right {
        font-size: .75em;
        margin: 0 1em;
        align-self: center;
      }
    }
  }
</style>
