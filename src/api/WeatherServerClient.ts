import axios, {AxiosError, AxiosResponse} from 'axios';
import config from '@/config';
import {WeatherLocation} from '@/domain/Location/WeatherLocation';

export class WeatherServerClient {

  public static availableLocations(): Promise<WeatherLocation[]> {
    return new Promise<WeatherLocation[]>((resolve: (params: WeatherLocation[]) => void,
                                           reject: (error: AxiosError) => void) => {
      axios.get(config.services.weather.uri + '/locations/')
        .then((response: AxiosResponse<WeatherLocation[]>) => resolve(response.data))
        .catch((response: AxiosError) => reject(response));
    });
  }

}
