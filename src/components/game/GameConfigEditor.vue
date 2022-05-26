<script lang="ts">
import {Component, Emit, Prop, Vue} from 'vue-property-decorator';
import BrokerSelector from '@/components/Broker/BrokerSelector.vue';
import {Broker} from '@/domain/Broker/Broker';
import {GameSpec} from '@/domain/Game/GameSpec';
import {WeatherConfigurationData} from '@/domain/Weather/WeatherConfigurationData';
import ParameterSetEditor from '@/components/parameter/ParameterSetEditor.vue';
import WeatherSelector from '@/components/weather/WeatherSelector.vue';
import FormattedDate from '@/components/time/FormattedDate.vue';

@Component({name: "game-config-editor", components: {'broker-selector': BrokerSelector, ParameterSetEditor, WeatherSelector, FormattedDate,}})
export default class GameConfigEditor extends Vue {

  @Prop({required: false, default: () => "Submit"})
  private submitLabel: string;

  private name: string;
  private serverParameters: {[key: string]: string};
  private brokers: Broker[];
  private weather: WeatherConfigurationData|null;

  constructor() {
    super();
    this.name = "";
    this.serverParameters = {};
    this.brokers = [];
    this.weather = null;
  }

  get isValid(): boolean {
    return this.brokers.length > 0;
  }

  get spec(): GameSpec {
    return {
      name: "",
      brokers: this.brokers,
      serverParameters: this.serverParameters,
      weather: this.weather !== null ? this.weather : undefined
    };
  }

  @Emit('update-game-spec')
  private updateGameSpec(): GameSpec|null {
    if (this.isValid) {
      const spec = this.spec;
      Vue.set(this, 'serverParameters', {});
      Vue.set(this, 'brokers', []);
      Vue.set(this, 'weather', null);
      return spec;
    } else {
      return null;
    }
  }

  private unsetWeather(): void {
    Vue.set(this, "weather", null);
  }

}
</script>

<template>
  <form id="game-form" @submit="updateGameSpec">
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
      <weather-selector v-on:submit="weather = $event" v-if="weather === null" />
      <div v-else>
        <span class="text-capitalize">{{weather.location.name}}</span>
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
