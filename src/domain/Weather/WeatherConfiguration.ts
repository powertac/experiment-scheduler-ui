import {WeatherLocation} from '@/domain/Location/WeatherLocation';
import moment from 'moment';

export interface WeatherConfiguration {
  location: WeatherLocation;
  startDate: number;
  startMoment: moment.Moment;
}
