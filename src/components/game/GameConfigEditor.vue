<script lang="ts">
import {Component, Emit, Prop, Vue} from 'vue-property-decorator';
import BrokerSelector from '@/components/Broker/BrokerSelector.vue';
import {Broker} from '@/domain/Broker/Broker';
import {WeatherConfigurationData} from '@/domain/Weather/WeatherConfigurationData';
import ParameterSetEditor from '@/components/parameter/ParameterSetEditor.vue';
import WeatherSelector from '@/components/weather/WeatherSelector.vue';
import FormattedDate from '@/components/time/FormattedDate.vue';
import {GameConfig} from '@/domain/Game/GameConfig';
import {WeatherConfiguration} from '@/domain/Weather/WeatherConfiguration';

@Component({name: "game-config-editor", components: {'broker-selector': BrokerSelector, ParameterSetEditor, WeatherSelector, FormattedDate,}})
export default class GameConfigEditor extends Vue {

  @Prop({required: false, default: () => "Submit"})
  private submitLabel: string;

  private serverParameters: {[key: string]: string};
  private brokers: Broker[];
  private weather: WeatherConfigurationData|null;

  constructor() {
    super();
    this.serverParameters = {};
    this.brokers = [];
    this.weather = null;
  }

  get isValid(): boolean {
    return this.brokers.length > 0;
  }

  get config(): GameConfig {
    return {
      brokers: this.brokers,
      parameters: this.serverParameters,
      weather: this.weather !== null ? this.weather : undefined
    };
  }

  @Emit('update-game-config')
  private updateGameConfig(): GameConfig|null {
    if (this.isValid) {
      const config = this.config;
      Vue.set(this, 'serverParameters', {});
      Vue.set(this, 'brokers', []);
      Vue.set(this, 'weather', null);
      return config;
    } else {
      return null;
    }
  }

  private setWeather(weather: WeatherConfiguration): void {
    this.weather = {
      location: weather.location.name,
      startTime: weather.startDate
    }
  }

  private unsetWeather(): void {
    Vue.set(this, "weather", null);
  }

}
</script>

<template>
  <form id="game-form" @submit="updateGameConfig">
    <div>
      <h2>Brokers</h2>
      <broker-selector v-on:selected="brokers = $event" />
    </div>
    <div>
      <h2>Parameters</h2>
      <parameter-set-editor @parameters-updated="serverParameters = $event" />
    </div>
    <div>
      <h2>Weather</h2>
      <weather-selector v-on:submit="setWeather" v-if="weather === null" />
      <div v-else>
        <span class="text-capitalize">{{weather.location}}</span>
        -
        <formatted-date :date="weather.startTime" />
        <button type="button" @click="unsetWeather"><fa-icon icon="times" /></button>
      </div>
    </div>
    <div>
      <button type="submit" :disabled="!isValid">{{ submitLabel }}</button>
    </div>
  </form>
</template>
