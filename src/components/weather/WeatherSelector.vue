<template>
  <div class="weather-selector">
    <div class="selection-group">
      <div class="selection-group-label">
        Location
      </div>
      <div class="selection-group-body">
        <div class="location-pill"
             v-for="location in availableLocations"
             :key="location.name"
             :class="{'selected': location === selected}"
             @click="select(location)">
          <div class="name text-capitalize">
            {{location.name}}
          </div>
          <div class="time-range">
            <div class="date-from">
              {{location.minTime.format(dateFormat)}}
            </div>
            <fa-icon icon="arrow-right" class="arrow-right" />
            <div class="date-to">
              {{location.maxTime.format(dateFormat)}}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="selection-group" :class="{'disabled': selected === null}">
      <div class="selection-group-label">
        <label for="weather-start-date">Start date</label>
      </div>
      <div class="selection-group-body">
        <div class="start-date">
          <input type="date" id="weather-start-date" class="form-control"
                 v-model="startDate"
                 :disabled="selected === null"
                 :class="{'disabled': selected === null}"
                 :min="selected !== null ? selected.minTime.format('YYYY-MM-DD') : ''"
                 :max="selected !== null ? selected.maxTime.format('YYYY-MM-DD') : ''">
        </div>
      </div>
    </div>
    <div class="selection-group mt-2">
      <div class="selection-group-label"></div>
      <div class="selection-group-body">
        <button type="button" class="btn btn-block btn-primary" :class="{'disabled': !isValid}" :disabled="!isValid" @click="submit">
          Add weather configuration
        </button>
      </div>
    </div>
  </div>
</template>

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
    Vue.set(this, 'startDate', location.minTime.format('YYYY-MM-DD'));
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

<style scoped lang="scss">

div.selection-group {
  display: flex;
  justify-content: left;
  align-items: start;

  div.selection-group-label {
    min-width: 15%;
    font-size: 1.25rem;
    margin: .2rem 0;
  }
  div.selection-group-body {
    min-width: 66%;
  }
}

div.location-pill {
  display: flex;
  margin-bottom: .5rem;
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

  &.selected {
    color: #000aa3;
    background: #F2F5FF;
    div.name, div.time-range {
      border-color: #A5B3E8;
      color: #000aa3;
    }
    div.time-range {
      border-left-color: rgba(165, 179, 232, .5);
    }
  }

}

input[type=date] {
  text-align: center;
  border-radius: .2rem;
  padding: .5rem 1rem;
  height: auto;
}
</style>
