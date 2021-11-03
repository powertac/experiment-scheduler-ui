import {WeatherLocation} from '@/domain/Location/WeatherLocation';
import moment from 'moment';

export class WeatherLocationImpl implements WeatherLocation {

  public name: string;
  public minReportTime: string;
  public maxReportTime: string;
  public minForecastTime: string;
  public maxForecastTime: string;

  constructor(name: string, minReportTime: string, maxReportTime: string, minForecastTime: string, maxForecastTime: string) {
    this.name = name;
    this.minReportTime = minReportTime;
    this.maxReportTime = maxReportTime;
    this.minForecastTime = minForecastTime;
    this.maxForecastTime = maxForecastTime;
  }

  get minTime(): moment.Moment {
    const minReportTime = moment(this.minReportTime);
    const minForecastTime = moment(this.minForecastTime);
    return minReportTime.isAfter(minForecastTime) ? minReportTime : minForecastTime;
  }

  get maxTime(): moment.Moment {
    const maxReportTime = moment(this.maxReportTime);
    const maxForecastTime = moment(this.maxForecastTime);
    return maxReportTime.isBefore(maxForecastTime) ? maxReportTime : maxForecastTime;
  }

}
