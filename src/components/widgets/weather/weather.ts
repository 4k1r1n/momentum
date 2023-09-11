import './owfont-regular.css';
import './weather.scss';
import dictionary from '../../../data/dictionary';
import State from '../../../interfaces/state';
import { getLanguage } from '../../../state';
import { OpenWeatherMapData } from '../../../types/api-data';
import createNode from '../../../utils/create-node';
import WeatherElements from '../../../types/weather';

// eslint-disable-next-line prettier/prettier
const getWeatherUrl = (lang: State['language'], city: string): string => `https://api.openweathermap.org/data/2.5/weather?q=${city}&lang=${lang}&appid=${process.env.OPENWEATHERMAP_API_KEY}&units=metric`;

async function getWeatherData(
  language: State['language'],
  value: string,
): Promise<OpenWeatherMapData> {
  const url = getWeatherUrl(language, value);
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error('Failed to fetch weather');
  }
}

const getWeather = async (
  lang: State['language'],
  city: string,
  elements: WeatherElements,
): Promise<void> => {
  const { icon, temperature, description, wind, humidity, error } = elements;
  const data = await getWeatherData(lang, city);
  const thirdClassName = icon.classList.item(2);
  try {
    icon.classList.add(`owf-${data.weather[0].id}`);
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    // eslint-disable-next-line prettier/prettier
    wind.textContent = `${dictionary[lang].windSpeed}: ${Math.round(data.wind.speed)} ${dictionary[lang].windSpeedUnit}`;
    humidity.textContent = `${dictionary[lang].weatherHumidity}: ${Math.round(
      data.main.humidity,
    )}%`;
    description.textContent = data.weather[0].description;
    error.textContent = '';
  } catch {
    if (thirdClassName) {
      icon.classList.remove(thirdClassName);
    }
    error.textContent = `${dictionary[lang].weatherError}`;
    wind.textContent = '';
    temperature.textContent = '';
    humidity.textContent = '';
    description.textContent = '';
  }
};

const renderWeather = (): HTMLElement => {
  const language = getLanguage();
  const weather = createNode('div', ['header__weather', 'weather']);
  const input = createNode('input', ['weather__city', 'input']);
  input.setAttribute('type', 'text');
  input.setAttribute('placeholder', `${dictionary[language].placeholderCity}`);
  const icon = createNode('i', ['weather__icon', 'owf']);
  const info = createNode('div', ['weather__info']);
  const temperature = createNode('p', ['weather__temperature']);
  const description = createNode('p', ['weather__description']);
  const wind = createNode('p', ['weather__wind']);
  const humidity = createNode('p', ['weather__humidity']);
  const error = createNode('p', ['weather__error']);
  const elements = { icon, temperature, description, wind, humidity, error };
  info.append(temperature, description);
  weather.append(input, icon, info, wind, humidity, error);
  input.addEventListener('change', () => {
    if (input instanceof HTMLInputElement) {
      getWeather(language, input.value, elements);
    }
  });
  return weather;
};

export default renderWeather;
