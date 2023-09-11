export type UnsplashData = {
  urls: {
    regular: string;
  };
};

export type FlickrData = {
  photos: {
    photo: Photo[];
  };
};

type OpenWeatherMapWeather = {
  id: number;
  description: string;
};

export type OpenWeatherMapData = {
  wind: {
    speed: number;
  };
  weather: OpenWeatherMapWeather[];
  main: {
    temp: number;
    humidity: number;
  };
};

export type Photo = {
  width_h: number;
  height_h: number;
  url_h: string;
};
