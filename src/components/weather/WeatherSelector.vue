<script lang="ts">
import {Component, Emit, Vue} from 'vue-property-decorator';
import {WeatherLocation} from '@/domain/Location/WeatherLocation';
import moment from 'moment';
import {WeatherConfigurationImpl} from '@/domain/Weather/WeatherConfigurationImpl';
import {WeatherConfigurationData} from '@/domain/Weather/WeatherConfigurationData';

@Component({name: "weather-selector"})
export default class WeatherSelector extends Vue {

  private selected: WeatherLocation|null;
  private startDate: string;

  constructor() {
    super();
    this.selected = null;
    this.startDate = '';
  }

  get availableLocations(): WeatherLocation[] {
    const locations: WeatherLocation[] = this.$store.getters['availableLocations'];
    if (locations.length == 1) {
      this.select(locations[0]);
    }
    return locations;
  }

  get dateFormat(): string {
    return 'MMM YYYY'
  }

  get startMoment(): moment.Moment {
    return moment(this.startDate);
  }

  get isValid(): boolean {
    return this.selected !== null
        && (this.startMoment.isAfter(this.selected.minTime)
            || this.startMoment.date() == this.selected.minTime.date())
        && (this.startMoment.isBefore(this.selected.maxTime)
            || this.startMoment.date() == this.selected.maxTime.date());
  }

  private select(location: WeatherLocation): void {
    Vue.set(this, 'selected', location);
  }

  private submit(): void {
    if (this.selected != null) {
      this.$emit('submit', new WeatherConfigurationImpl(
          this.selected,
          this.startMoment.valueOf()));
    }
    this.updateWeatherConfig();
  }

  @Emit('update-weather-config')
  private updateWeatherConfig(): WeatherConfigurationData|null {
    return this.selected != null
        ? {location: this.selected.name, startTime: this.startMoment.valueOf()}
        : null;
  }

}
</script>

<template>
  <div class="weather-selector">
      <table class="key-value">
        <thead>
        <tr>
          <th></th>
          <th>Location</th>
          <th class="text-center">Available time range</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="location in availableLocations"
            :key="location.name"
            :class="{'selected': location === selected}"
            @click="select(location)">
          <td class="text-center">
            <fa-icon :icon="selected && selected.name === location.name ? ['far', 'check-circle'] : ['far', 'circle']" />
          </td>
          <td class="text-capitalize">{{location.name}}</td>
          <td class="text-center">
            {{location.minTime.format(dateFormat)}}
            <fa-icon icon="arrow-right" class="arrow-right" />
            {{location.maxTime.format(dateFormat)}}
          </td>
        </tr>
        </tbody>
      </table>
      <div class="start-date">
        <label for="weather-start-date">Start date</label>
        <input type="date" id="weather-start-date"
               v-model="startDate"
               :disabled="selected === null"
               :class="{'disabled': selected === null}"
               :min="selected !== null ? selected.minTime.format('YYYY-MM-DD') : ''"
               :max="selected !== null ? selected.maxTime.format('YYYY-MM-DD') : ''">
      </div>
    <button type="button" class="button button-block" :class="{'disabled': !isValid}" :disabled="!isValid" @click="submit">
      Set weather conditions
    </button>
  </div>
</template>



<style scoped lang="scss">
div.weather-selector {
  border-radius: .2rem;
  display: flex;
  flex-direction: column;
  align-items: start;

  table.key-value {

    tbody > tr > td {
      cursor: pointer;
      color: #1E293B;

      &:first-child {
        padding-right: 0;
      }

      &:nth-child(2) {
        padding-right: 3rem;
      }
    }

    tbody > tr.selected > td {
      background: #CCFBF1;
      color: #115E59;
    }

    .arrow-right {
      font-size: .7rem;
      margin: 0 .66rem;
    }

  }

  div.start-date {
    margin-top: .66rem;
    width: 100%;

    label {
      text-transform: uppercase;
      font-size: .75em;
      font-weight: normal;
      border: 1px solid #CBD5E1;
      border-bottom-color: #E2E8F0;
      background: #F1F5F9;
      color: #1E293B;
      padding: .33rem;
      width: 100%;
      text-align: center;
      border-radius: .2rem .2rem 0 0;
      margin: 0;
    }

    input[type=date] {
      text-align: center;
      border-radius: 0 0 .2rem .2rem;
      padding: .66rem 2rem;
      height: auto;
      cursor: pointer;
      width: 100%;
      outline: none;
      border: 1px solid #CBD5E1;
      border-top: 0;

      &[disabled=disabled] {
        background: #F1F5F9;
        cursor: not-allowed;
      }
    }
  }
}
button[type=button].button {
  margin-top: .66rem;
  padding: 1.1em 1.66em .9em 1.66em;
}
</style>
