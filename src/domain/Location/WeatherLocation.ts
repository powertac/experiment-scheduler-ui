import moment from 'moment';

export interface WeatherLocation {
  name: string;
  minReportTime: string;
  maxReportTime: string;
  minForecastTime: string;
  maxForecastTime: string;

  minTime: moment.Moment;
  maxTime: moment.Moment;
}
