<script lang="ts">
import {Component, Emit, Prop, Vue} from 'vue-property-decorator';
import BrokerSelector from '@/components/Broker/BrokerSelector.vue';
import {Broker} from '@/domain/Broker/Broker';
import {WeatherConfigurationData} from '@/domain/Weather/WeatherConfigurationData';
import ParameterSetEditor from '@/components/parameter/ParameterSetEditor.vue';
import WeatherSelector from '@/components/weather/WeatherSelector.vue';
import FormattedDate from '@/components/time/FormattedDate.vue';
import {GameConfig} from '@/domain/Game/GameConfig';
import GameValidator from '@/domain/Game/GameValidator';
import {GameSpec} from '@/domain/Game/GameSpec';

@Component({components: {BrokerSelector, ParameterSetEditor, WeatherSelector, FormattedDate}})
export default class GameEditor extends Vue {

  @Prop({required: false, default: () => false})
  private withName: boolean;

  @Prop({required: false, default: () => "Submit"})
  private submitLabel: string;

  private name: string;
  private brokers: Broker[];
  private weather: WeatherConfigurationData|null;
  private serverParameters: {[key: string]: string};

  constructor() {
    super();
    this.name = "";
    this.brokers = [];
    this.weather = null;
    this.serverParameters = {};
  }

  get isValid(): boolean {
    return this.brokers.length > 0
        && this.weather !== null
        && (!this.withName || this.hasValidName);
  }

  get hasValidName(): boolean {
    return GameValidator.isValidName(this.name);
  }

  get game(): GameConfig|GameSpec {
    const game: GameConfig|GameSpec = {
      brokers: this.brokers,
      parameters: this.serverParameters,
      serverParameters: this.serverParameters,
      weather: this.weather !== null ? this.weather : undefined
    };
    if (this.withName) {
      game.name = this.name;
    }
    return game;
  }

  @Emit('update-game')
  private updateGame(): GameConfig|GameSpec|null {
    return this.isValid ? this.game : null;
  }

}
</script>

<template>
  <form class="game-config-editor">
    <div class="editor-block" v-if="withName">
      <h2>Name</h2>
      <input v-model="name" type="text" class="text-input w-full" />
    </div>
    <div class="editor-block">
      <h2>Brokers</h2>
      <broker-selector v-on:selected="brokers = $event" />
    </div>
    <div class="editor-block">
      <h2>Weather conditions</h2>
      <div class="weather-conditions">
        <weather-selector v-on:update-weather-config="weather = $event" v-if="weather === null" />
        <!-- TODO : move to weather selector -->
        <table class="selected-weather key-value" v-else>
          <thead>
          <tr>
            <th>Location</th>
            <th class="text-center">Start date</th>
            <th></th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td class="text-capitalize">{{weather.location}}</td>
            <td class="text-center"><formatted-date :date="weather.startTime" /></td><!-- TODO : remove time part (date only) -->
            <td class="text-right"><fa-icon icon="times" @click="weather = null" /></td>
          </tr>
          </tbody>
        </table>
        <p>The weather conditions are defined by a location and a starting date. Available conditions are managed by the weather server. Please check the <a href="https://github.com/powertac/powertac-weather-server">Weather Server GitHub page</a> for further information.</p>
      </div>
    </div>
    <div class="editor-block">
      <h2>Parameters</h2>
      <parameter-set-editor @parameters-updated="serverParameters = $event" />
    </div>
    <div>
      <button type="button" @click="updateGame" class="button editor-submit" :disabled="!isValid">{{ submitLabel }}</button>
    </div>
  </form>
</template>

<style lang="scss">
div.weather-conditions {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  gap: 2rem;
  align-items: start;

  & > div.weather-selector, & > table.selected-weather {
    flex-grow: 1;
  }

  & > p {
    max-width: 33%;
    margin: 0;
  }

}
.game-config-editor {
  padding-bottom: 6.66rem;
}
</style>
