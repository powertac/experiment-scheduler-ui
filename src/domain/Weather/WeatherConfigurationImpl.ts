import {WeatherConfiguration} from '@/domain/Weather/WeatherConfiguration';
import {WeatherLocation} from '@/domain/Location/WeatherLocation';
import moment from 'moment';

export class WeatherConfigurationImpl implements WeatherConfiguration {

  public location: WeatherLocation;
  public startDate: number;

  constructor(location: WeatherLocation, startDate: number) {
    this.location = location;
    this.startDate = startDate;
  }

  get startMoment(): moment.Moment {
    return moment(this.startDate);
  }

}
